//////////////////////////////
//  Actions for dealing with components
//////////////////////////////
"use strict";

import ids from "oak-roots/util/ids";
import { die, dieIfMissing } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import api from "../api";
import JSXFragment from "../JSXFragment";
import Page from "../Page";
import oak from "../oak";

import utils from "./utils";

// set to `true` to log messages as actions proceed
const DEBUG = true;


// Save the component to the server.
// NOTE: this is currently not undoable.
// TODO: this doesn't return a transaction, so can't be used in other undo contexts... ???
export function saveComponent({ component }) {
  return component.save("FORCE");
}


//////////////////////////////
//  Rename component (changes id)
//////////////////////////////
export function _renameComponentTransaction(options = {}) {
  dieIfMissing(options, "renameComponent", ["component", "updateInstance"]);
  let {
    component,                        // REQUIRED: Component to change
    updateInstance,                   // REQUIRED: Method to update component and children
    newId,                            // OPTIONAL: New id for the component.
    prompt = !oak.event.optionKey,    // OPTIONA:  If `true`, we'll prompt for a new name if newId is not set.
                                      //           Default is to confirm unless the option key is down.
    navigate = false,                 // OPTIONAL: If true, we'll update the url after renaming.
    actionName = `Rename ${component.type}`,
    autoExecute
  } = options

  // if `newId` was not specified, prompt
  if (!newId && prompt) {
    newId = window.prompt("New name for ${component.type}?", component.id);
    if (!newId) return;
  }

  // default to component's id, and make sure it's unique within the parent
  if (!newId) newId = component.id;
  newId = component.parent.uniquifyChildId(newId)

  const redoParams = {
    component,
    newId,
    updateInstance,
    navigate
  }

  const undoParams = {
    component,
    newId: component.id,
    updateInstance,
    navigate
  }

  return new UndoTransaction({
    redoActions:[ () => _renameComponent(redoParams) ],
    undoActions:[ () => _renameComponent(undoParams) ],
    actionName,
    autoExecute
  });
}

// Rename a component and optionally navigate to a new route.
// No parameter normalization!
export function _renameComponent(options) {
  dieIfMissing(options, "_renameComponent", ["component", "newId", "updateInstance"]);
  const { component, newId, updateInstance, navigate } = options;
  if (DEBUG) console.info(`renameComponent({ component: ${component}, newId: ${newId}, navigate: ${navigate}  })`);

  return api.changeComponentId({
      type: component.type,
      path: component.path,
      newId
    })
    // response returns the parentIndex JSON data
    .then( parentIndexJSON => {
      // NOTE: the order is important here!
      // 1: changeId() in the parentIndex
      component.parentIndex.changeId(component.id, newId);

      // 2: update component and children in place
      utils.updateComponentAndChildren(component, updateInstance, [newId]);

      // 3: update parentIndex with data we got back
      component.parentIndex.loaded(parentIndexJSON);

console.info("component renamed" + (route ? ", navigating..." : ""));
      // navigate if desired
      if (navigate && oak.page) utils.navigateToRoute(oak.page.route, "REPLACE");
    });
}



//////////////////////////////
//  Remove component.  Undoing adds the component back.
//////////////////////////////

export function _deleteComponentTransaction(options = {}) {
  dieIfMissing(options, "deleteComponent", ["component"]);
  let {
    component,                      // REQUIRED: Component to delete as Component object or path.
    navigate,                       // OPTIONAL: If `true`, we'll navigate to the next component after delete.
    confirm = !oak.event.optionKey, // OPTIONAL: If `true`, we'll show a confirm dialog before deleting.
                                    // Default is to confirm unless the option key is down.
    actionName = "Delete ${component.type}",
    autoExecute
  } = options;

// TODO: error/etc if only child in parent

  if (confirm) {
    // TODO: confirm with a nicer alert
    const answer = window.confirm(`Really delete ${component.type} ${component.title}?`);
    if (answer === false) return;
  }

  let route;
  if (navigate) {
    if (component.next) route = component.next.route;
    if (component.prev) route = component.prev.route;
  }

  const deleteParams = {
    component,
    route
  }

  const createParams = {
    parent: component.parent,
    type: component.type,
    path: component.path,
    data: component.getDataToSave(),
    indexData: component.getIndexData(),
    position: component.position,
    // navigate back to current page on undo if route is set
    route: route && oak.page && oak.page.route
  };

  return new UndoTransaction({
    redoActions:[ () => _deleteComponent(deleteParams) ],
    undoActions:[ () => _createComponent(createParams) ],
    actionName,
    autoExecute
  });
}


// Delete a component and optionally navigate to a new route.
// No parameter normalization!
export function _deleteComponent({ component, route }) {
  if (DEBUG) console.info(`_deleteComponent({ component: ${component}, route: ${route} })`);

  if (typeof component === "string") component = oak.get(component);
  if (!component) throw new TypeError(`actions utils.deleteComponent(${component}): component not found`);

  return api.deleteComponent({ type: component.type, path: component.path })
    // response returns the parentIndex JSON data
    .then( parentIndexJSON => {
      // update the parentIndex data, which should remove the item from the index
      component.parentIndex.loaded(parentIndexJSON);

console.info("component deleted" + (route ? `, navigating to ${route}` : ""));
      // navigate
      if (route) utils.navigateToRoute(route, "REPLACE");
    });
}


//////////////////////////////
//  Add component.  Undoing removes the component.
//////////////////////////////
export function _createComponentTransaction(options = {}) {
//TOOD: DIE
  let {
    parent,
    type,
    path,
    data,
    indexData,
    position,
    route,
    actionName = "New ${component.type}",
    autoExecute
  } = options;

  // prompt for title if necessary
  if (!title && prompt) {
    title = window.prompt("Name for new ${type}?", "Untitled");
    if (!title) return;
  }

  if (!pageId) {
    if (title)  pageId = ids.normalizeIdentifier(title);
    else        pageId = JSXFragment.getRandomOid();
  }

  // make sure pageId is unique within it's parent
  pageId = parent.uniquifyChildId(pageId);

  path = Page.getPath(projectId, sectionId, pageId);

  // get parameter data BEFORE creating transaction
  const createParams = {
    parent,
    type,
    path,
    data,
    indexData: { id: pageId, title },
    position,
    route: navigate && oak.getPageRoute(projectId, sectionId, pageId)
  };

  // On undo, go back to the current component if we're navigating
  const deleteParams = {
    component: path,
    route: navigate && oak.page && oak.page.route
  }
}

// Create a component.
// NOTE: it's up to you to make sure there's not already a component at `path`!
// No parameter normalization or checking!
export function createComponent({ parent, type, path, data, indexData, position, route }) {
  if (DEBUG) console.info(`_createPage({ path: ${path}, data: ${data}, indexData: ${indexData}, position: ${position}, navigate: ${navigate} })`);
  return api.createComponent({ type, path, data, indexData, position })
    // returns json with:  `{ path, component, parentIndex }`
    .then( response => {
      // ORDER is important:
      // 1. update the parentIndex
      parent.childIndex.loaded(response.parentIndex);

      // 2. get the new component
      const component = oak.get(response.path);
      if (!component) {
        // this is an error -- we should be able to get the component now
        console.error(`actions._createPage(${response.path}): server ${type} created but client ${type} not found`);
        return Promise.resolve();
      }

      // 3. have the component update with the response data
      component.loaded(response.component);

console.info("component created" + (route ? `, navigating to ${route}` : ""));

      // 4. navigate if necessary
      if (route) navigateToRoute(route);
    });

  return new UndoTransaction({
    redoActions:[ () => utils.createComponent(createParams) ],
    undoActions:[ () => utils.deleteComponent(deleteParams) ],
    actionName,
    autoExecute
  });
}



//////////////////////////////
//  Duplicate some component.  Undoing removes the component.
//////////////////////////////
export function duplicatePage(options = {}) {
  let {
    component = oak.page,                // default to current page
    pageId = component && component.id,   // default to component's id, createPage() will uniquify.
    position = oak.page && oak.page.position + 1, // optional: 1-based numeric position within the parent, undefined = place after current component
    navigate = true,  // optional: if true, we'll navigate to the component after creation
    actionName = "Duplicate Page", autoExecute
  } = options;

  if (!component) die(oak, "actions.duplicatePage", [options], "component not found");

  return createPage({
    projectId: page.projectId,
    sectionId: page.sectionId,
    pageId,
    data: component.getDataToSave(),
    position,
    navigate,
    actionName,
    autoExecute
  });

}

// Export all as a lump
export default Object.assign({}, exports);

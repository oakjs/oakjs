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
export function renameComponentTransaction(options = {}) {
  dieIfMissing(options, "renameComponent", ["component", "newId", "updateInstance"]);

  let {
    component,                // REQUIRED: Component to change
    newId,                    // REQUIRED: New id for the component
    updateInstance,           // REQUIRED: Method to update component and children
    route,                    // OPTIONAL: Route to navigate to on rename.
    actionName = `Rename ${component.type}`,
    autoExecute
  } = options

  const redoParams = {
    component,
    newId,
    updateInstance,
    route
  }
  const undoParams = {
    component,
    newId: component.id,
    updateInstance,
    // navigate back to current page on undo if route is set
    route: route && oak.page && oak.page.route
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
export function _renameComponent({ component, newId, updateInstance, route }) {
  if (DEBUG) console.info(`renameComponent({ component: ${component}, newId: ${newId}, route: ${route}  })`);
  return api.changeComponentId({
      type: component.type,
      path: component.path,
      newId
    })
    // response returns the parentIndex JSON data
    .then( parentIndexJSON => {
      // NOTE: the order is important here!
      // 1: changeId() in the section parentIndex
      component.parentIndex.changeId(component.id, newId);

      // 2: update component and children in place
      utils.updateComponentAndChildren(component, updateInstance, [newId]);

      // 3: update parentIndex with data we got back
      component.parentIndex.loaded(parentIndexJSON);


console.info("component renamed" + (route ? `, navigating to ${route}` : ""));
      // navigate if desired
      if (route) utils.navigateToRoute(route, "REPLACE");
    });
}



//////////////////////////////
//  Remove component.  Undoing adds the component back.
//////////////////////////////

export function deleteComponent(options = {}) {
  let {
    component = oak.page,                // Component to delete as Component object or path.
    confirm = !oak.event.optionKey, // If `true`, we'll show a confirm dialog before deleting.
                                    // Default is to confirm unless the option key is down.
    actionName = "Delete ${component.type}",
    autoExecute
  } = options;

  if (typeof component === "string") component = oak.get(component);
  if (!component) die(oak, "actions.deleteComponent", [options], "you must specify options.component");

  // try to go to the component after, if that doesn't work, we're at the end, go to the one before
  // If we don't get anything, this is the only component in the parent
// TODO: can't delete only component in the parent -- ask if they want to delete parent?
  const nextPage = component.parent.getChild(page.position + 1) || component.parent.getChild(page.position - 1);

  if (confirm) {
    // TODO: confirm with a nicer alert
    const answer = window.confirm(`Really delete ${type} ${component.title}?`);
    if (answer === false) return;
  }

  // Only navigate if we're on the same page
  const navigate = (page === oak.page);

  // get parameter data BEFORE creating transaction
  const deleteParams = {
    component,
    route: navigate && nextPage && nextPage.route
  }

  const createParams = {
    parent: component.parent,
    type: type,
    path: component.path,
    data: component.getDataToSave(),
    indexData: component.getIndexData(),
    position: component.position,
    route: component.route
  };

  return new UndoTransaction({
    redoActions:[ () => utils.deleteComponent(deleteParams) ],
    undoActions:[ () => utils.createComponent(createParams) ],
    actionName,
    autoExecute
  });
}



//////////////////////////////
//  Add component.  Undoing removes the component.
//////////////////////////////
export function createComponent(options = {}) {
  let {
    projectId = oak.page && oak.page.projectId,   // default to current
    sectionId = oak.page && oak.page.sectionId,
    pageId,
    title,            // optional: title for the page (DEFAULT???)
    data,             // optional: data object for page with `{ jsxe, script, styles }`
    position = oak.page && oak.page.position + 1, // optional: 1-based numeric position within the parent, undefined = place after current component
    prompt = true,    // optional: if true and title is not specified, we'll prompt for component title
    navigate = true,  // optional: if true, we'll navigate to the component after creation
    actionName = "New ${component.type}",
    autoExecute
  } = options;

  // verify that project/parent exist
  const parent = oak.getSection(projectId, sectionId);
  if (!parent) die(oak, "actions.createComponent", [options], "parent not found");

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

  const path = Page.getPath(projectId, sectionId, pageId);

  // get parameter data BEFORE creating transaction
  const createParams = {
    parent: parent,
    type: type,
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

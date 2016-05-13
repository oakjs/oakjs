//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import api from "../api";
import JSXFragment from "../JSXFragment";
import Page from "../Page";
import oak from "../oak";

import utils from "./utils";


// Save the page to the server.
// NOTE: this is currently not undoable.
// TODO: this doesn't return a transaction, so can't be used in other undo contexts... ???
export function savePage() {
  return oak.page.save("FORCE");
}


//////////////////////////////
//  Change page id -- requires disk changes.
//////////////////////////////

// Change a page's id.
export function changePageId(options = {}) {
  let {
    path = oak.page && oak.page.path,    // Path for page to change
    toId,                                // New id for the page
    actionName = "Rename Page", autoExecute
  } = options
  // check parameters
  if (typeof path !== "string") die(oak, "actions.changePageId", [options], "you must specify options.path");
  if (!toId) die(oak, "actions.changePageId", [options], "you must specify options.id");

  const { projectId, sectionId, originalId } = path.split("/");
  const toPath = Page.getPath(projectId, sectionId, toId);

  // Only navigate if we're on the same page
  const navigate = (oak.page && oak.page.path === path);

  return new UndoTransaction({
    redoActions:[ () => _changePageId({ path, toId, navigate }) ],
    undoActions:[ () => _changePageId({ path: toPath, toId: originalId, navigate }) ],
    actionName,
    autoExecute
  });
}

// Internal routine to actually rename and possibly navigate.
// No parameter normalization!
function _changePageId({ path, toId, navigate }) {
  return api.changeComponentId({
      type: "page",
      path,
      toId
    })
    // response returns the section's pageIndex JSON data
    .then( pageIndexJSON => {
      const page = oak.getPage(path);
      if (!page) {
        console.warn(`actions._getPageId(${path}): id changed but page not found`);
        return;
      }
      // NOTE: the order is important here!
      // 1: changeId() in the section pageIndex
      page.section.pageIndex.changeId(page.pageId, toId);

      // 2: update page in place
      page.pageId = toId;

      // 3: update section pageIndex with data we got back
      page.section.pageIndex.loaded(pageIndexJSON);

console.info("page id changed" + (navigate ? ", navigating..." : ""));
      // navigate if desired
      if (navigate) {
        utils.navigateToRoute(page.route, "REPLACE");
      }
    });
}


//////////////////////////////
//  Remove page.  Undoing adds the page back.
//////////////////////////////

export function deletePage(options) {
  let {
    page = oak.page,      // Page to delete as Page object or path.
    confirm = false,      // If you pass true, we'll show a confirm dialog first.
    actionName = "Delete Page", autoExecute
  } = options;

  if (typeof page === "string") page = oak.registry.getPage(...page.split("/"));
  if (!page) die(oak, "actions.deletePage", [options], "you must specify options.page");

  // try to go to the page after, if that doesn't work, we're at the end, go to the one before
  // If we don't get anything, this is the only page in the section
// TODO: can't delete only page in the section -- ask if they want to delete section?
  const nextPage = page.section.getPage(position + 1) || page.section.getPage(position - 1);

  if (confirm) {
    // TODO: confirm with a nicer alert
    const answer = window.confirm(`Really delete page ${page.title}?`);
    if (answer === false) return;
  }

  // get the old page data for undo
  const path = page.path;

  // Only navigate if we're on the same page
  const navigate = (page === oak.page);

  // get parameter data BEFORE creating transaction
  const deletePageParams = {
    path,
    route: navigate && nextPage && nextPage.route
  }

  const createPageParams = {
    path,
    title: page.title,
    data: page.getDataToSave(),
    position: page.position,
    navigate
  };

  return new UndoTransaction({
    redoActions:[ () => _deletePage(deletePageParams) ],
    undoActions:[ () => _createPage(createPageParams) ],
    actionName,
    autoExecute
  });
}
// Internal routine to actually delete the page.
// No parameter normalization or checking!
function _deletePage({ path, route }) {
  return api.deleteComponent({ type: "page", path })
    // response returns the sectionIndex JSON data
    .then( pageIndexJSON => {
      // update the section's pageIndex data, which should remove the page from the index
      const section = oak.getSection(path);
      if (section) section.pageIndex.loaded(pageIndexJSON);

      // navigate
      if (route) utils.navigateToRoute(route, "REPLACE");
    });
}




//////////////////////////////
//  Add page.  Undoing removes the page.
//////////////////////////////
export function createPage(options) {
  const {
    projectId = oak.page && oak.page.projectId,
    sectionId = oak.page && oak.page.sectionId,
    pageId = JSXFragment.getRandomOid(),
    title,            // optional: title for the page (DEFAULT???)
    data,             // optional: data object for page with `{ jsxe, script, styles }`
    position,         // optional: 1-based numeric position within the section, undefined = place at the end
    navigate = true,  // optional: if true, we'll navigate to the page after creation
    actionName = "New Page", autoExecute
  } = options;

  // verify that project/section exist
  const section = oak.getSection(projectId, sectionId);
  if (!section) die(oak, "actions.createPage", [options], "project or section not found");

  const path = Page.path(projectId, sectionId, pageId);
  const currentRoute = (navigate ? oak.page && oak.page.route : undefined);

  // get parameter data BEFORE creating transaction
  const createPageParams = {
    path,
    title,
    data,
    position,
    navigate
  };

  // On undo, go back to the current page if we're navigating
  const deletePageParams = {
    path,
    route: navigate && oak.page && oak.page.route
  }

  return new UndoTransaction({
    redoActions:[ () => _createPage(createPageParams) ],
    undoActions:[ () => _deletePage(deletePageParams) ],
    actionName,
    autoExecute
  });
}
// Internal routine to actually create the page.
// No parameter normalization or checking!
function _createPage({ path, title, data, position, navigate }) {
  return api.createComponent({ type: "page", path, title, data, position })
    .then( responseJSON => console.warn(responseJSON) );
}

// Export all as a lump
export default Object.assign({}, exports);

//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import ids from "oak-roots/util/ids";
import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import api from "../api";
import JSXFragment from "../JSXFragment";
import Page from "../Page";
import oak from "../oak";

import component from "./component";
import utils from "./utils";

// set to `true` to log messages as actions proceed
const DEBUG = true;


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
export function renamePage(options = {}) {
  let {
    page = oak.page,        // Page to change
    newId,                  // New id for the page
    prompt,                 // If `true`, we'll prompt for a new name if newId is not set.
    actionName,
    autoExecute
  } = options

  // normalize page
  if (typeof page === "string") page = oak.getPage(page);
  if (!page) die(oak, "actions.deletePage", [options], "you must specify options.page");

  return component._renameComponentTransaction({
    component: page,
    newId,
    updateInstance: function(component, id) { component.pageId = id },
    navigate: (page === oak.page),
    actionName,
    autoExecute
  });
}


//////////////////////////////
//  Remove page.  Undoing adds the page back.
//////////////////////////////

export function deletePage(options = {}) {
  let {
    page = oak.page,                // Page to delete as Page object or path.
    confirm,
    actionName,
    autoExecute
  } = options;

  // normalize page
  if (typeof page === "string") page = oak.getPage(page);
  if (!page) die(oak, "actions.deletePage", [options], "you must specify options.page");

  return component._deleteComponentTransaction({
    component: page,
    navigate: (page == oak.page),   // navigate if on current page
    confirm,
    actionName,
    autoExecute
  });
}



//////////////////////////////
//  Add page.  Undoing removes the page.
//////////////////////////////
export function createPage(options = {}) {
  let {
    projectId = oak.page && oak.page.projectId,   // default to current project...
    sectionId = oak.page && oak.page.sectionId,   // ... and section
    pageId,
    title,            // optional: title for the page (DEFAULT???)
    data,             // optional: data object for page with `{ jsxe, script, styles }`
    position = oak.page && oak.page.position + 1, // optional: 1-based numeric position within the section, undefined = place after current page
    prompt = true,    // optional: if true and title is not specified, we'll prompt for page title
    navigate = true,  // optional: if true, we'll navigate to the page after creation
    actionName = "New Page",
    autoExecute
  } = options;

  // verify that project & section exist
  const section = oak.getSection(projectId, sectionId);
  if (!section) die(oak, "actions.createPage", [options], "project or section not found");

  // prompt for title if necessary
  if (!title && prompt) {
    title = window.prompt("Name for new ${component.type}?", "Untitled ${component.type}");
    if (!title) return;
  }

  if (!pageId) {
    if (title)  pageId = ids.normalizeIdentifier(title);
    else        pageId = JSXFragment.getRandomOid();
  }

  // make sure pageId is unique within it's section
  pageId = section.uniquifyChildId(pageId);

  const path = Page.getPath(projectId, sectionId, pageId);

  // get parameter data BEFORE creating transaction
  const createParams = {
    parent: section,
    type: "page",
    path,
    data,
    indexData: { id: pageId, title },
    position,
    route: navigate && oak.getPageRoute(projectId, sectionId, pageId)
  };

  // On undo, go back to the current page if we're navigating
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
//  Duplicate some page.  Undoing removes the page.
//////////////////////////////
export function duplicatePage(options = {}) {
  let {
    page = oak.page,                // default to current page
    pageId = page && page.pageId,   // default to page's name, createPage will uniquify.
    position = oak.page && oak.page.position + 1, // optional: 1-based numeric position within the section, undefined = place after current page
    navigate = true,  // optional: if true, we'll navigate to the page after creation
    actionName = "Duplicate Page", autoExecute
  } = options;

  if (!page) die(oak, "actions.duplicatePage", [options], "page not found");

  return createPage({
    projectId: page.projectId,
    sectionId: page.sectionId,
    pageId,
    title: page.title,
    data: page.getDataToSave(),
    position,
    navigate,
    actionName,
    autoExecute
  });

}

// Export all as a lump
export default Object.assign({}, exports);

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
    page = oak.page,         // Page to change
    newId,                   // New id for the page
    prompt = true,           // If `true` and `newId` is not specified, we'll ask interactively.
    actionName,
    autoExecute
  } = options

  // if `newId` was not specified, prompt
  if (!newId && prompt) {
    newId = window.prompt("New name for page?", page.id);
    if (!newId) return;
  }

  // default to unique'd pageId
  newId = page.section.uniquifyChildId(newId || pageId)

  return component.renameComponentTransaction({
    component: page,
    newId,
    updateInstance: function(component, id) { component.pageId = id },
    route: (page === oak.page) && oak.getPageRoute(page.projectId, page.sectionId, newId),
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
    confirm = !oak.event.optionKey, // If `true`, we'll show a confirm dialog before deleting.
                                    // Default is to confirm unless the option key is down.
    actionName = "Delete Page", autoExecute
  } = options;

  if (typeof page === "string") page = oak.getPage(page);
  if (!page) die(oak, "actions.deletePage", [options], "you must specify options.page");

  // try to go to the page after, if that doesn't work, we're at the end, go to the one before
  // If we don't get anything, this is the only page in the section
// TODO: can't delete only page in the section -- ask if they want to delete section?
  const nextPage = page.section.getPage(page.position + 1) || page.section.getPage(page.position - 1);

  if (confirm) {
    // TODO: confirm with a nicer alert
    const answer = window.confirm(`Really delete page ${page.title}?`);
    if (answer === false) return;
  }

  // Only navigate if we're on the same page
  const navigate = (page === oak.page);

  // get parameter data BEFORE creating transaction
  const deleteParams = {
    component: page,
    route: navigate && nextPage && nextPage.route
  }

  const createParams = {
    parent: page.section,
    type: "page",
    path: page.path,
    data: page.getDataToSave(),
    indexData: page.getIndexData(),
    position: page.position,
    route: page.route
  };

  return new UndoTransaction({
    redoActions:[ () => utils.deleteComponent(deleteParams) ],
    undoActions:[ () => utils.createComponent(createParams) ],
    actionName,
    autoExecute
  });
}



//////////////////////////////
//  Add page.  Undoing removes the page.
//////////////////////////////
export function createPage(options = {}) {
  let {
    projectId = oak.page && oak.page.projectId,   // default to current
    sectionId = oak.page && oak.page.sectionId,
    pageId,
    title,            // optional: title for the page (DEFAULT???)
    data,             // optional: data object for page with `{ jsxe, script, styles }`
    position = oak.page && oak.page.position + 1, // optional: 1-based numeric position within the section, undefined = place after current page
    prompt = true,    // optional: if true and title is not specified, we'll prompt for page title
    navigate = true,  // optional: if true, we'll navigate to the page after creation
    actionName = "New Page", autoExecute
  } = options;

  // verify that project/section exist
  const section = oak.getSection(projectId, sectionId);
  if (!section) die(oak, "actions.createPage", [options], "project or section not found");

  // prompt for title if necessary
  if (!title && prompt) {
    title = window.prompt("Name for new page?", "Untitled Page") || "Untitled Page";
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

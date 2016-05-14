//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import ids from "oak-roots/util/ids";
import { die, dieIfMissing } from "oak-roots/util/die";
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
  if (!page) die(oak, "actions.deletePage", [options], "you must specify a page");

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
  if (!page) die(oak, "actions.deletePage", [options], "you must specify a page");

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
    section = oak.section,    // default to current section
    pageId,                   // id for the page (we'll make one up if necessary)
    data,                     // data object for page with `{ jsxe, script, styles }`
    position = oak.page && oak.page.position + 1,
                              // 1-based numeric position within the section, undefined = place after current page
    title,                    // title for the page
    prompt = true,            // if true and title is not specified, we'll prompt for page title
    navigate = true,          // if true, we'll navigate to the page after creation
    actionName,
    autoExecute
  } = options;

  // normalize section
  if (typeof section === "string") section = oak.getPage(section);
  if (!section) die(oak, "actions.createPage", [options], "you must specify a section");

  return component._createComponentTransaction({
    parent: section,
    type: "page",
    newId: pageId,
    title,
    prompt,
    data,
    position,
    navigate,
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
    position,                       // 1-based numeric position within the section, undefined = place after current page
    title,                          // title for the new page, defaults to same as current page
    navigate,                       // if true, we'll navigate to the page after creation
    actionName = "Duplicate Page",
    autoExecute
  } = options;

  if (!page) die(oak, "actions.duplicatePage", [options], "page not found");

  return createPage({
    section: page.section,
    pageId,
    data: page.getDataToSave(),
    position,
    title: title || page.title,
    navigate,
    actionName,
    autoExecute
  });
}

// Export all as a lump
export default Object.assign({}, exports);

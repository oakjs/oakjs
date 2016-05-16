//////////////////////////////
//  Page Actions
//////////////////////////////
"use strict";

import { die, dieIfMissing } from "oak-roots/util/die";

import Page from "../Page";
import oak from "../oak";

import component from "./component";
import navigation from "./navigation";
import utils from "./utils";

// set to `true` to log messages as actions proceed
const DEBUG = true;


// Show some page.
export function showPage(options = {}) {
  let {
    page = oak.page,            // Page or page path, defaults to current page
    replace,
    actionName = "Show Page",
    autoExecute
  } = options;

  // normalize page to path string
  if (page instanceof Page) page = page.path;
  if (typeof page !== "string") die(oak, "actions.showPage", [options], "you must specify a page");

  const { projectId, sectionId, pageId } = Page.splitPath(page);

  return navigation._navigateToRouteTransaction({
    route: oak.getPageRoute(projectId, sectionId, pageId),
    replace,
    actionName,
    autoExecute
  })
}


// Show first / previous / next / first / last page
export function showFirstPage(options) { return _showRelativePage("FIRST", options); }
export function showPreviousPage(options) { return _showRelativePage("PREV", options); }
export function showNextPage(options) { return _showRelativePage("NEXT", options); }
export function showLastPage(options) { return _showRelativePage("LAST", options); }

function _showRelativePage(which, options) {
  if (!oak.page) return;

  let page;
  if (which === "FIRST")        page = oak.page.section.firstChild;
  else if (which === "PREV")    page = oak.page.previous;
  else if (which === "NEXT")    page = oak.page.next;
  else if (which === "LAST")    page = oak.page.section.lastChild;
  const showPageOptions = Object.assign({ page }, options);
  return showPage(showPageOptions);
}


// Save the page to the server.
// NOTE: this is currently not undoable.
// TODO: this doesn't return a transaction, so can't be used in other undo contexts... ???
export function savePage(options = {}) {
  let {
    page = oak.page
  } = options;

  // normalize page to Page object
  if (typeof page === "string") page = oak.account.getPage(page);
  if (!page) die(oak, "actions.savePage", [options], "you must specify a page");

  return page.save("FORCE");
}


//////////////////////////////
//  Rename page (change it's id)
//////////////////////////////
export function renamePage(options = {}) {
  let {
    page = oak.page,        // Page to change
    newId,                  // New id for the page
    prompt,                 // If `true`, we'll prompt for a new name if newId is not set.
    actionName,
    autoExecute
  } = options

  // normalize page to Page object
  if (typeof page === "string") page = oak.account.getPage(page);
  if (!page) die(oak, "actions.renamePage", [options], "you must specify a page");

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
//  Delete page.  Undoing adds the page back.
//////////////////////////////
export function deletePage(options = {}) {
  let {
    page = oak.page,                // Page to delete as Page object or path.
    confirm,
    actionName,
    autoExecute
  } = options;

  // normalize page to Page object
  if (typeof page === "string") page = oak.account.getPage(page);
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
//  Add page.  Undoing deletes the new page.
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
  if (typeof section === "string") section = oak.account.getSection(section);
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
//  Duplicate some page.  Undoing deletes the new page.
//////////////////////////////
export function duplicatePage(options = {}) {
  let {
    page = oak.page,                // default to current page
    pageId = page && page.pageId,   // default to page's name, duplicatePage will uniquify.
    position,                       // 1-based numeric position within the section, undefined = place after current page
    title,                          // title for the new page, defaults to same as current page
    prompt,                         // if true and title is not specified, we'll prompt for page title
    navigate,                       // if true, we'll navigate to the page after creation
    actionName = "Duplicate Page",
    autoExecute
  } = options;

  // normalize page to Page object
  if (typeof page === "string") page = oak.account.getPage(page);
  if (!page) die(oak, "actions.duplicatePage", [options], "you must specify a page");

  return component._duplicateComponentTransaction({
    component: page,
    newId: pageId,
    position,
    title,
    prompt,
    navigate,
    actionName,
    autoExecute
  });
}

// Export all as a lump
export default Object.assign({}, exports);

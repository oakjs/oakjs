//////////////////////////////
//  Page Actions
//////////////////////////////
"use strict";

import Action from "oak-roots/Action";
import { die, dieIfMissing } from "oak-roots/util/die";

import Account from "../Account";
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

  // handle relative page specifier
  if (page === "FIRST") page = oak.page && oak.page.section.firstChild;
  else if (page === "PREV") page = oak.page && oak.page.previous
  else if (page === "NEXT") page = oak.page && oak.page.next;
  else if (page === "LAST") page = oak.page && oak.page.section.lastChild;

  // normalize page to path string
  if (page instanceof Page) page = page.path;
  if (typeof page !== "string") die(oak, "actions.showPage", [options], "you must specify a page");

  const { projectId, sectionId, pageId } = Account.splitPath(page);

  return navigation._navigateToRouteTransaction({
    route: oak.getPageRoute(projectId, sectionId, pageId),
    replace,
    actionName,
    autoExecute
  })
}


new Action({
  id: "oak.showFirstPage", title: "Show First Page",
  handler: () => showPage({ page: "FIRST" }),
  hidden: () => oak.pageCount < 3,
  disabled:() => !oak.page || oak.page.isFirst
});

new Action({
  id: "oak.showPreviousPage", title: "Show Previous Page",
  handler: () => showPage({ page: "PREV" }),
  hidden: () => oak.pageCount < 2,
  disabled:() => !oak.page || oak.page.isFirst
});

new Action({
  id: "oak.showNextPage", title: "Show Next Page",
  handler: () => showPage({ page: "NEXT" }),
  hidden: () => oak.pageCount < 2,
  disabled:() => !oak.page || oak.page.isLast
});

new Action({
  id: "oak.showLastPage", title: "Show Last Page",
  handler: () => showPage({ page: "LAST" }),
  hidden: () => oak.pageCount < 3,
  disabled:() => !oak.page || oak.page.isLast
});


//////////////////////////////
//  Save a page.
//////////////////////////////

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

new Action({
  id: "oak.savePage", title: "Save Page", shortcut: "Meta S",
  handler: savePage,
  disabled:() => !oak.page
});


//////////////////////////////
//  Add page.  Undoing deletes the new page.
//////////////////////////////
export function createPage(options = {}) {
  let {
    section = oak.section,    // default to current section
    pageId,                   // id for the page (we'll make one up if necessary)
    data,                     // data object for page with `{ jsxe, script, styles }`
    position,                 // numeric position within the section, undefined = place after current page
    title,                    // title for the page
    prompt = true,            // if true and title is not specified, we'll prompt for page title
    navigate = true,          // if true, we'll navigate to the page after creation
    actionName,
    autoExecute
  } = options;

  // normalize section
  if (typeof section === "string") section = oak.account.getSection(section);
  if (!section) die(oak, "actions.createPage", [options], "you must specify a section");

  // place after current section by default
  if (!position && oak.page) position = oak.page.position + 1;

  return component._createComponentTransaction({
    parent: section,
    type: "Page",
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

new Action({
  id: "oak.createPage", title: "New Page...",
  handler: createPage,
  disabled:() => !oak.section
});

//////////////////////////////
//  Duplicate some page.  Undoing deletes the new page.
//////////////////////////////
export function duplicatePage(options = {}) {
  let {
    page = oak.page,                // default to current page
    pageId,                         // id for new page (may end up derived from title)
    position,                       // numeric position within the section, undefined = place after current page
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

new Action({
  id: "oak.duplicatePage", title: "Duplicate Page...",
  handler: duplicatePage,
  disabled:() => !oak.page
});


//////////////////////////////
//  Rename page (change it's id)
//////////////////////////////
export function renamePage(options = {}) {
  let {
    page = oak.page,        // Page to change
    newTitle,               // New title for the page.  Will be generated from `newTitle` if not provided.
    newId,                  // New id for the page.  Will be generated from `newTitle` if not provided.
    prompt,                 // If `true`, we'll prompt for a new name if neither `newTitle` nor `newId` is set.
    actionName,
    autoExecute
  } = options

  // normalize page to Page object
  if (typeof page === "string") page = oak.account.getPage(page);
  if (!page) die(oak, "actions.renamePage", [options], "you must specify a page");

  return component._renameComponentTransaction({
    component: page,
    newTitle,
    newId,
    updateInstance: function(component, id) { component.pageId = id },
    prompt,
    navigate: (page === oak.page),
    actionName,
    autoExecute
  });
}

new Action({
  id: "oak.renamePage", title: "Rename Page...",
  handler: renamePage,
  disabled:() => !oak.page
});


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

new Action({
  id: "oak.deletePage", title: "Delete Page",
  handler: deletePage,
  disabled:() => !oak.page
});


// Export all as a lump
export default Object.assign({}, exports);

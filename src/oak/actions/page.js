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
    newId,                    // New id for the page
    prompt = true,           // If `true` and `newId` is not specified, we'll ask.
    actionName = "Rename Page", autoExecute
  } = options
  // check parameters
  if (!page) die(oak, "actions.renamePage", [options], "you must specify options.page");

  // if `newId` was not specified, prompt
  if (!newId && prompt) {
    newId = window.prompt("New name for page?", page.pageId);
    if (!newId) return;
  }
  if (!newId) die(oak, "actions.renamePage", [options], "you must specify options.newId");

  // Only navigate if we're showing the same page
  const navigate = (oak.page === page);

  // Function to update page in place
  function updateInstance(component, id) {
    component.pageId = id;
  }

  const redoParams = {
    component: page,
    newId,
    updateInstance,
    route: navigate && oak.getPageRoute(page.projectId, page.sectionId, newId)
  }
  const undoParams = {
    component: page,
    newId: page.pageId,
    updateInstance,
    route: navigate && page.route
  }

  return new UndoTransaction({
    redoActions:[ () => utils.renameComponent(redoParams) ],
    undoActions:[ () => utils.renameComponent(undoParams) ],
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
    path: page.path,
    title: page.title,
    data: page.getDataToSave(),
    position: page.position,
    navigate
  };

  return new UndoTransaction({
    redoActions:[ () => utils.deleteComponent(deleteParams) ],
    undoActions:[ () => _createPage(createParams) ],
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
    title = window.prompt("Name for new page?", "Untitled") || "";
  }

  if (!pageId) {
    if (title)  pageId = ids.normalizeIdentifier(title);
    else        pageId = JSXFragment.getRandomOid();
  }

  // make sure pageId is unique within it's section
  pageId = section.uniquifyPageId(pageId);

  const path = Page.getPath(projectId, sectionId, pageId);
  const currentRoute = (navigate ? oak.page && oak.page.route : undefined);

  // get parameter data BEFORE creating transaction
  const createParams = {
    path,
    title,
    data,
    position,
    navigate
  };

  // On undo, go back to the current page if we're navigating
  const deleteParams = {
    path,
    route: navigate && oak.page && oak.page.route
  }

  return new UndoTransaction({
    redoActions:[ () => _createPage(createParams) ],
    undoActions:[ () => _deletePage(deleteParams) ],
    actionName,
    autoExecute
  });
}
// Internal routine to actually create the page.
// NOTE: it's up to you to make sure there's not already a page at `path`!
// No parameter normalization or checking!
function _createPage({ path, title, data, position, navigate }) {
  if (DEBUG) console.info(`_createPage({ path: ${path}, title: ${title}, data: ${data}, position: ${position}, navigate: ${navigate} })`);
  return api.createComponent({ type: "page", path, title, data, position })
    // returns json with:  `{ index, item }`
    .then( ({ index: pageIndexData, item: pageData }) => {
      const section = oak.getSection(path);
      if (!section) {
        // it's not necessarily an error if we can't find the page, just warn and continue
        console.warn(`actions._createPage(${path}): server page created but section not found`);
        return Promise.resolve();
      }
      // ORDER is important:
      // 1. update the section's pageIndex
      section.pageIndex.loaded(pageIndexData);

      // 2. get the new page
      const page = oak.getPage(path);
      if (!page) {
        // this is an error -- we should be able to get the page now
        console.error(`actions._createPage(${path}): server page created but client page not found`);
        return Promise.resolve();
      }

      // 3. have the page update with the response data
      page.loaded(pageData);

      // 4. navigate if necessary
      if (navigate) utils.navigateToRoute(page.route, "REPLACE");
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

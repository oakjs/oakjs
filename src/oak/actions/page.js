//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import api from "../api";
import JSXFragment from "../JSXFragment";
import oak from "../oak";

import utils from "./utils";


// Save the page to the server.
// NOTE: this is currently not undoable.
// TODO: this doesn't return a transaction, so can't be used in other undo contexts... ???
export function savePage() {
  return oak.page.save("FORCE");
}


// Rename a page (eg: change it's id).
export function renamePage(options) {
  let {
    page = oak.page,    // page to change
    id: newId,          // new id for the page
    actionName = "Rename Page", autoExecute
  } = options

  if (typeof page === "string") page = oak.registry.getPage(...page.split("/"));

  if (!page) die(oak, "actions.renamePage", [options], "you must specify options.page");
  if (!newId) die(oak, "actions.renamePage", [options], "you must specify options.id");

  const oldId = page.pageId;

  // Only navigate if we're on the same page
  const oldRoute = (page === oak.page ? oak.getPageRoute(page.projectId, page.sectionId, oldId) : undefined);
  const newRoute = (page === oak.page ? oak.getPageRoute(page.projectId, page.sectionId, newId) : undefined);

  let undo = function() { return _renamePage(page, newId, oldId, oldRoute) };
  let redo = function() { return _renamePage(page, oldId, newId, newRoute) };

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}

// Internal routine to actually rename and possibly navigate
function _renamePage(page, fromId, toId, route) {
  return api.renameComponent(page, fromId, toId)
    .then( () => {
      // update page
      page.pageId = toId;
      // update section pageIndex
      page.section.pageIndex.changeId(fromId, toId)
      // navigate to route if provided
      if (route) utils.navigateToRoute(route, "REPLACE");
    });
}


// Create a new page.
// Undoing deletes the page.
export function createPage(options) {
  const {
    projectId = oak.page && oak.page.projectId,
    sectionId = oak.page && oak.page.sectionId,
    pageId = JSXFragment.getRandomOid(),
    index,  // index in the section, undefined = place at the end
    title,  // optional title for the page
    jsxe,   // optional JSXE content
    script, // optional script content
    styles, // optional styles content
    actionName = "New Page", autoExecute
  } = options;

  // TODO: verify that section/project exist?
  if (!projectId) die(oak, "actions.createPage", [options], "you must specify options.pageId");
  if (!sectionId) die(oak, "actions.createPage", [options], "you must specify options.sectionId");



}


// Export all as a lump
export default Object.assign({}, exports);

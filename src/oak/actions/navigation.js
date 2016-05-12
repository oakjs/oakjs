//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";

import selection from "./selection";
import utils from "./utils";


// Go to some `route`.
// All other navigation should go through this one.
// Ignored if current `page.route` is the same as `route` passed in.
// NOTE: clears selection and restores on undo.
export function navigateTo(options) {
  const {
    route, replace = false,
    actionName = "Show Page", autoExecute
  } = options;
  if (!route) throw new TypeError(`oak.actions.navigateTo(): route not provided`);

  const currentRoute = oak.page && oak.page.route;
  if (route === currentRoute) return;

  // clear selection upon navigation as well
  const oldSelection = [].concat(oak.selection);
  function undo(){ return utils.navigateToRoute(currentRoute, replace, oldSelection) }
  function redo(){ return utils.navigateToRoute(route, replace, []) }

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}


// Show the first page of a `project`.
export function showProject(options) {
  const {
    project = oak.page && oak.page.projectId,
    replace = false,
    actionName = "Show Project", autoExecute
  } = options;

  if (!project) return;

  return navigateTo({
    route: oak.getPageRoute(project),
    replace,
    actionName,
    autoExecute
  })
}

// Show the first page of a `section`.
export function showSection(options) {
  const {
    project = oak.page && oak.page.projectId,
    section = oak.page && oak.page.sectionId,
    replace = false,
    actionName = "Show Section", autoExecute
  } = options;

  if (!section) return;

  return navigateTo({
    route: oak.getPageRoute(project, section),
    replace,
    actionName,
    autoExecute
  })
}

// Show some page.
export function showPage(options) {
  const {
    project = oak.page && oak.page.projectId,
    section = oak.page && oak.page.sectionId,
    page = oak.page && oak.page.pageId,
    replace = false,
    actionName = "Show Page", autoExecute
  } = options;

  if (!page) return;

  return navigateTo({
    route: oak.getPageRoute(project, section, page),
    replace,
    actionName,
    autoExecute
  })
}


// Show first / previous / next / first / last page
export function showFirstPage(options) { return _showRelativePage("FIRST", options); }
export function showPreviousPage(options) { return _showRelativePage(-1, options); }
export function showNextPage(options) { return _showRelativePage(1, options); }
export function showLastPage(options) { return _showRelativePage("LAST", options); }

function _showRelativePage(delta, options) {
  if (!oak.page) return;

  const props = {
    project: oak.project.projectId,
    section: oak.section.sectionId,
    page: oak.page.pageIndex
  };

  if (delta === "FIRST") props.page = 1;
  else if (delta === "LAST") props.page = oak.section.pages.length;
  else if (typeof delta === "number") props.page += delta;
  else {
    throw new TypeError(`oak.actions.showRelativePage(${delta}): delta must be "FIRST", "LAST" or a number`);
  }

  return showPage(Object.assign(props, options));
}

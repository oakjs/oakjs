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
// NOTE: clear selection and restores on undo.
export function navigateTo(options) {
  const {
    route, replace = false,
    actionName = "Show Page", returnTransaction
  } = options;
  if (!route) throw new TypeError(`oak.actions.navigateTo(): route not provided`);

  const currentRoute = oak.page && oak.page.route;
  if (route === currentRoute) return;

  function undo(){ return _navigateToRoute(currentRoute, replace, oldSelection) }
  function redo(){ return _navigateToRoute(route, replace, []) }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });

  // if something is currently selected, clear selection (and restore on undo)
  const oldSelection = oak.selection;
  if (oldSelection.length) {
    const selectionTransaction = selection.clearSelection({ returnTransaction: true });
    transaction.addTransaction(selectionTransaction);
  }

  if (returnTransaction) return transaction;
  return oak.undoQueue.addTransaction(transaction);
}


// Show the first page of a `project`.
export function showProject(options) {
  const {
    project = oak.page && oak.page.projectId,
    replace = false,
    actionName = "Show Project", returnTransaction
  } = options;

  if (!project) return;

  return navigateTo({
    route: oak.getPageRoute(project),
    replace,
    actionName,
    returnTransaction
  })
}

// Show the first page of a `section`.
export function showSection(options) {
  const {
    project = oak.page && oak.page.projectId,
    section = oak.page && oak.page.sectionId,
    replace = false,
    actionName = "Show Section", returnTransaction
  } = options;

  if (!section) return;

  return navigateTo({
    route: oak.getPageRoute(project, section),
    replace,
    actionName,
    returnTransaction
  })
}

// Show some page.
export function showPage(options) {
  const {
    project = oak.page && oak.page.projectId,
    section = oak.page && oak.page.sectionId,
    page = oak.page && oak.page.pageId,
    replace = false,
    actionName = "Show Page", returnTransaction
  } = options;

  if (!page) return;

  return navigateTo({
    route: oak.getPageRoute(project, section, page),
    replace,
    actionName,
    returnTransaction
  })
}

function showRelativePage(delta, options) {
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

  console.dir(props);

  return showPage(Object.assign(props, options));
}

// Show first / previous / next / first / last page
export function showFirstPage(options) { return showRelativePage("FIRST", options); }
export function showPreviousPage(options) { return showRelativePage(-1, options); }
export function showNextPage(options) { return showRelativePage(1, options); }
export function showLastPage(options) { return showRelativePage("LAST", options); }


//////////////////////////////
//  Utility functions to actually manipulate the state
//////////////////////////////

function _navigateToRoute(route, replace) {
  if (!oak._router) throw new TypeError(`oak.actions._navigateToRoute(${route}): oak._router is not set`);
  if (replace || oak._router.isActive(route)) {
    oak._router.replace(route);
  }
  else {
    oak._router.push(route);
  }
}
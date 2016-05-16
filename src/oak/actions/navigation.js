//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";
import Page from "../Page";
import Project from "../Project";
import Section from "../Section";

import selection from "./selection";
import utils from "./utils";


// Go to some `route`.
// All other navigation should go through this one.
// Ignored if current `page.route` is the same as `route` passed in.
// NOTE: clears selection and restores on undo.
export function _navigateToRouteTransaction(options = {}) {
  const {
    route,
    replace = false,
    actionName = "Show Page",
    autoExecute
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
export function showProject(options = {}) {
  let {
    project = oak.page && oak.page.project,   // Project or project path, defaults to current project
    replace,
    actionName = "Show Project",
    autoExecute
  } = options;

  // normalize project
  if (project instanceof Project) project = project.path;
  if (typeof project !== "string") die(oak, "actions.showProject", [options], "you must specify a project");

  const { projectId } = Project.splitPath(project);
  return navigateTo({
    route: oak.getPageRoute(projectId),
    replace,
    actionName,
    autoExecute
  })
}


// Export all as a lump
export default Object.assign({}, exports);

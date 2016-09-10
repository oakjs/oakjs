//////////////////////////////
//  Actions for dealing with pages
//////////////////////////////
"use strict";

import Action from "oak-roots/Action";
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


// Navigate to some `route`.
export function navigateTo(options) {
  return _navigateToRouteTransaction(options);
}


new Action({
  id: "oak.navigateTo",
  title: "UNDEFINED oak.navigateTo.title",
  route: "UNDEFINED oak.navigateTo.route",
  replace: false,
  handler: function() {
    return _navigateToRouteTransaction({
      route: this.route,
      replace: this.replace,
      actionName: this.title
    })
  },
//  disabled:() => !oak.page || oak.page.isFirst
});



// Export all as a lump
export default Object.assign({}, exports);

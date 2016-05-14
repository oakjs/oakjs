//////////////////////////////
//  Utilities for dealing with elements
//
//  NOTE: These routines should not be called directly except by other actions.
//        DO NOT include this file in `actions/index.js`
//////////////////////////////

import { die, dieIfMissing, dieIfOutOfRange } from "oak-roots/util/die";
import UndoQueue, { UndoTransaction } from "oak-roots/UndoQueue";

import api from "../api";
import ComponentController from "../ComponentController";
import JSXElement from "../JSXElement";

export function getOidOrDie(thing, operation) {
  if (typeof thing === "string") return thing;
  if (thing instanceof JSXElement) return thing.oid;
  die(oak, operation, thing, "Can't figure out oid!");
}

export function getOidsOrDie(_things, operation) {
  if (!_things || _things.length === 0) {
    die(oak, operation, _things, "You must provide at least one item");
  }
  const things = Array.isArray(_things) ? _things : [_things];
  return things.map(thing => getOidOrDie(thing, operation));
}


//////////////////////////////
//  Guards
//////////////////////////////

export function getControllerOrDie(context = oak.editContext, operation) {
  if (context instanceof ComponentController) return context;
  if (typeof context === "string") return ProjectRegistry.get(context);
  die(oak, operation, context, "Couldn't get controller -- is this a valid path?");
}

export function getFragmentOrDie(context, operation) {
  const controller = getControllerOrDie(context, operation);
  return controller.jsxFragment;
}




//////////////////////////////
//  Utility functions to change app state for use by transactions only
//////////////////////////////

// Return a new app state which applies deltas to the state
export function changeAppState(deltas) {
  const newState = Object.assign({}, oak.state, deltas);
  return setAppState(newState);
}

// Change app state directly (not in a transaction).
export function setAppState(newState) {
console.info("setAppState", newState);
  oak.state = Object.freeze(newState);
  oak.preference("appState", oak.state);
  oak.updateSoon();
  return oak.state;
}


//////////////////////////////
//  Utility functions to change selection, for use by transactions only
//////////////////////////////

export function setSelection(selection = []) {
  return changeAppState({ selection: selection });
}


//////////////////////////////
//  Utility functions to navigate, for use by transactions only
//////////////////////////////

export function navigateToRoute(route, replace, selection) {
  if (!oak._router) throw new TypeError(`oak.actions._navigateToRoute(${route}): oak._router is not set`);
  if (replace || oak._router.isActive(route)) {
    oak._router.replace(route);
  }
  else {
    oak._router.push(route);
  }
  // update selection if new selection was passed in
  if (selection !== undefined) setSelection(selection);
}



//////////////////////////////
//  Utility functions to manipulate components, for use by transactions only
//////////////////////////////

// Internal routine to actually rename a component and optionally navigate to a new route.
// No parameter normalization!
export function renameComponent({ component, newId, updateInstance, route }) {
  if (DEBUG) console.info(`renameComponent({ component: ${component}, newId: ${newId}, route: ${route}  })`);
  return api.changeComponentId({
      type: component.type,
      path: component.path,
      newId
    })
    // response returns the parentIndex JSON data
    .then( parentIndexJSON => {
      // NOTE: the order is important here!
      // 1: changeId() in the section parentIndex
      component.parentIndex.changeId(component.id, newId);

      // 2: update component and children in place
      _updateComponentAndChildren(component, updateInstance, [newId]);

      // 3: update parentIndex with data we got back
      component.parentIndex.loaded(parentIndexJSON);


console.info("component id changed" + (route ? `, navigating to ${route}` : ""));
      // navigate if desired
      if (route) {
        navigateToRoute(route, "REPLACE");
      }
    });
}

function _updateComponentAndChildren(component, update, updateArgs) {
  if (!component) return;
  update(component, ...updateArgs);
  (component.children || []).forEach( child => _updateComponentAndChildren(child, update, updateArgs) );
}


// Export all in one go
export default Object.assign({}, exports);


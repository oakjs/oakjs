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

export function getControllerOrDie(controller = oak.editController, operation) {
  if (controller instanceof ComponentController) return controller;
  if (typeof controller === "string") return ProjectRegistry.get(controller);
  die(oak, operation, controller, "Couldn't get controller -- is this a valid path?");
}

export function getFragmentOrDie(controller, operation) {
  return getControllerOrDie(controller, operation).jsxFragment;
}


//////////////////////////////
//  Component utilities
//////////////////////////////

// Execute `update(updateArgs)` for the `component` and recursively for all its children.
export function updateComponentAndChildren(component, update, updateArgs) {
  if (!component) return;
  update(component, ...updateArgs);
  (component.children || []).forEach( child => updateComponentAndChildren(child, update, updateArgs) );
}



//////////////////////////////
//  Utility functions to change app state for use by transactions only
//////////////////////////////

// Return a new app state which applies deltas to the state
export function setAppState(deltas) {
  const newState = Object.assign({}, oak.state, deltas);
  return replaceAppState(newState);
}

// Change app state directly (not in a transaction).
export function replaceAppState(newState) {
//console.info("replaceAppState", newState);
  oak.state = Object.freeze(newState);
  oak.preference("appState", oak.state);
  oak.updateSoon();
  return oak.state;
}


//////////////////////////////
//  Utility functions to change selection, for use by transactions only
//////////////////////////////

export function setSelection(selection = []) {
  return setAppState({ selection: selection });
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


// Export all in one go
export default {...exports};


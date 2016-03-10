//////////////////////////////
//  Actions for dealing with elements
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import app from "../app";

import utils from "./utils";

//////////////////////////////
//  Manipulating app state
//////////////////////////////

export function startEditing(options) {
  return setAppState({ state: { editing: true }, ...options });
}

export function stopEditing(options) {
  return setAppState({ state: { editing: false }, ...options });
}


//////////////////////////////
//  Selection
//////////////////////////////



export function addToSelection(options) {
  const {
    elements,
    operation = "addToSelection", returnTransaction
  } = options;

  const newSelection = cloneSelection();
  // make sure we don't add something twice
  const oidsToAdd = utils.getOidsOrDie(elements, operation)
    .filter( oid => !newSelection.includes(oid) );

  return setSelection({
    selection: newSelection.concat(oidsToAdd),
    operation,
    returnTransaction
  });
}

// Add one or more `elements` to the current selection.
export function removeFromSelection(options = {}) {
  const {
    elements,
    operation = "removeFromSelection", returnTransaction
  } = options;

  const oidsToRemove = utils.getOidsOrDie(elements, operation);

  return setSelection({
    selection: cloneSelection().filter( oid => oidsToRemove.includes(oid) ),
    operation,
    returnTransaction
  })
}

export function clearSelection(options = {}) {
  const {
    operation = "clearSelection", returnTransaction
  } = options;

  setSelection({
    selection: [],
    operation,
    returnTransaction
  });
}

// Set the current selection to a new array of oids.
export function setSelection(options = {}) {
  const {
    selection,
    operation = "setSelection", returnTransaction, actionName = "Change Selection"
  } = options;

  return setAppState({
    actionName,
    state: { selection },
    operation,
    returnTransaction,
  });
}


// Return a clone of the current app selection (or an empty array if the selection is empty).
function cloneSelection() {
  if (app.state.selection) return [].concat(app.state.selection);
  return [];
}


//////////////////////////////
//  Generic app state manipulators
//  Consider making a specific sugar function instead of calling directly.
//////////////////////////////


export function setAppState(options = {}) {
  const {
    state: stateDeltas,
    actionName = "Set app state", returnTransaction
  } = options;

  if (stateDeltas == null) die(app, "setAppState", arguments, "`options.state` must be provided.");

  const originalState = app.state;
  const newState = Object.assign({}, originalState, stateDeltas);

  function redo() {
    app.state = newState;
    app.updateSoon();
  }

  function undo() {
    app.state = originalState;
    app.updateSoon();
  }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });
  if (returnTransaction) return transaction;
  return app.undoQueue.addTransaction(transaction);
}




// Export all as a lump
export default Object.assign({}, exports);

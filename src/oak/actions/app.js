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



// Add one or more `elements` to the current selection.
export function addToSelection(options) {
  const {
    elements,
    operation = "addToSelection", returnTransaction
  } = options;

  const selection = app.selection;
  // make sure we don't add something twice
  const oidsToAdd = utils.getOidsOrDie(elements, operation)
    .filter( oid => !selection.includes(oid) );

  if (oidsToAdd.length === 0) return;

  return _setSelection({
    selection: selection.concat(oidsToAdd),
    operation,
    returnTransaction
  });
}

// Remove one or more `elements` from the current selection.
export function removeFromSelection(options = {}) {
  const {
    elements,
    operation = "removeFromSelection", returnTransaction
  } = options;

  const selection = app.selection;
  // remove anything that's not currently in the selection
  const oidsToRemove = utils.getOidsOrDie(elements, operation)
    .filter( oid => selection.includes(oid) );

  if (oidsToRemove.length === 0) return;

  return _setSelection({
    selection: selection.filter( oid => !oidsToRemove.includes(oid) ),
    operation,
    returnTransaction
  })
}

// Toggle the `elements` in the current selection.
export function toggleSelection(options = {}) {
  const {
    elements,
    operation = "toggleSelection", returnTransaction
  } = options;

  const oids = utils.getOidsOrDie(elements, operation);
  if (oids.length === 0) return;

  // remove all `oids` if the first item is in the selection
  const selection = app.selection;
  if (selection.includes(oids[0])) {
    return removeFromSelection({
      elements: oids,
      operation,
      returnTransaction
    })
  }
  // otherwise add to the selection
  return addToSelection({
    elements: oids,
    operation,
    returnTransaction
  })
}


// Clear the current selection entirely.
export function clearSelection(options = {}) {
  const {
    returnTransaction
  } = options;

  return _setSelection({
    actionName: "Clear Selection",
    selection: [],
    returnTransaction
  });
}

// Set the current selection to the set of `elements` passed in.
export function setSelection(options = {}) {
  const {
    elements,
    operation = "setSelection", returnTransaction,
  } = options;

  const selection = utils.getOidsOrDie(elements, operation);

  return _setSelection({
    selection,
    operation,
    returnTransaction,
  });
}

// Internal function to change the selection assuming normalized `options.selection`.
function _setSelection(options = {}) {
  const {
    selection = [],
    operation = "_setSelection", returnTransaction, actionName = "Change Selection"
  } = options;

  // Freeze the selection so it can't be modified accidentally
  Object.freeze(selection);

  return setAppState({
    actionName,
    state: { selection },
    operation,
    returnTransaction,
  });
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

  // Freeze app state so it can't be modified without going through this routine
  Object.freeze(newState);

  function redo() {
    app._saveState(newState);
  }

  function undo() {
    app._saveState(originalState);
  }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });
  if (returnTransaction) return transaction;
  return app.undoQueue.addTransaction(transaction);
}




// Export all as a lump
export default Object.assign({}, exports);

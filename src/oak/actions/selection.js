//////////////////////////////
//  Actions for manipulating global selection
//////////////////////////////
"use strict";

import { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";

import app from "./app";
import utils from "./utils";


//////////////////////////////
//  Selection
//////////////////////////////

// Add one or more `elements` to the current selection.
export function addToSelection(options) {
  const {
    elements,
    operation = "addToSelection", returnTransaction
  } = options;

  const selection = oak.selection;
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

  const selection = oak.selection;
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
  const selection = oak.selection;
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


// Select everything in the current editContext
export function selectAll(options = {}) {
  const {
    context = oak.editContext,
    operation = "selectAll", returnTransaction
  } = options;

  const selection = utils.getOidsOrDie(context.descendentOids, operation);

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

  // bail if selection is not actually changing
  if (selection && oak.selection && selection.join("") === oak.selection.join("")) return;

  // Freeze the selection so it can't be modified accidentally
  Object.freeze(selection);

  return app.setAppState({
    actionName,
    state: { selection },
    operation,
    returnTransaction,
  });
}


// Export all as a lump
export default Object.assign({}, exports);

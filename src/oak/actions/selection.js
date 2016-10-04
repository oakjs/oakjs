//////////////////////////////
//  Actions for manipulating global selection
//////////////////////////////
"use strict";

import Action from "oak-roots/Action";
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
    controller,
    elements,
    operation = "addToSelection", autoExecute = true
  } = options;

  const selection = oak.selection;
  // make sure we don't add something twice
  const oidsToAdd = utils.getOidsOrDie(elements, operation)
    .filter( oid => !selection.includes(oid) );

  if (oidsToAdd.length === 0) return;

  return _setSelectionTransaction({
    controller,
    selection: selection.concat(oidsToAdd),
    autoExecute
  });
}

// Remove one or more `elements` from the current selection.
export function removeFromSelection(options = {}) {
  const {
    controller,
    elements,
    operation = "removeFromSelection", autoExecute = true
  } = options;

  const selection = oak.selection;
  // remove anything that's not currently in the selection
  const oidsToRemove = utils.getOidsOrDie(elements, operation)
    .filter( oid => selection.includes(oid) );

  if (oidsToRemove.length === 0) return;

  return _setSelectionTransaction({
    controller,
    selection: selection.filter( oid => !oidsToRemove.includes(oid) ),
    autoExecute
  })
}

// Toggle the `elements` in the current selection.
export function toggleSelection(options = {}) {
  const {
    controller,
    elements,
    operation = "toggleSelection", autoExecute = true
  } = options;

  const oids = utils.getOidsOrDie(elements, operation);
  if (oids.length === 0) return;

  // remove all `oids` if the first item is in the selection
  const selection = oak.selection;
  if (selection.includes(oids[0])) {
    return removeFromSelection({
      elements: oids,
      operation,
      autoExecute
    })
  }
  // otherwise add to the selection
  return addToSelection({
    controller,
    elements: oids,
    operation,
    autoExecute
  })
}


// Clear the current selection entirely.
export function clearSelection(options = {}) {
  const {
    controller,
    autoExecute = true
  } = options;

  return _setSelectionTransaction({
    actionName: "Clear Selection",
    controller,
    selection: [],
    autoExecute
  });
}

// Set the current selection to the set of `elements` passed in.
export function setSelection(options = {}) {
  const {
    controller,
    elements,
    operation = "setSelection", autoExecute = true
  } = options;

  const selection = utils.getOidsOrDie(elements, operation);

  return _setSelectionTransaction({
    controller,
    selection,
    autoExecute,
  });
}


// Select everything in the current editController
export function selectAll(options = {}) {
  const {
    controller = oak.editController,
    operation = "selectAll", autoExecute = true
  } = options;

  const selection = utils.getOidsOrDie(controller.descendentOids, operation);

  return _setSelectionTransaction({
    controller,
    selection,
    autoExecute,
  });
}


// Internal function to change the selection assuming normalized `options.selection`.
function _setSelectionTransaction(options = {}) {
  const {
    controller = oak.editController,
    selection = [],
    autoExecute = true, actionName = "Change Selection"
  } = options;

  // bail if selection is not actually changing
  const originalSelection = oak.selection;
  if (selection && originalSelection && selection.join("") === originalSelection.join("")) return;

  function undo() { return controller.setState({ selection: originalSelection }); }
  function redo() { return controller.setState({ selection: selection }); }

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}


//////////////////////////////
//  Menu-type actions
//////////////////////////////

// Select all (which takes us into selection mode if necessary).
function selectAllAction(options = {}) {
  const {
    actionName = "Select All",
    autoExecute
  } = options;

  return new UndoTransaction({
    actionName: actionName,
    transactions: [
      app.startSelecting({autoExecute: false }),
      selectAll({ autoExecute: false })
    ],
    autoExecute
  });
}

new Action({
  id: "oak.selectAll", title: "Select All", shortcut: "Meta A",
  handler: selectAllAction,
  disabled: () => !oak.editController
});

new Action({
  id: "oak.deselectAll", title: "Deselect All", shortcut: "Meta Shift A",
  handler: clearSelection,
  disabled: () => !oak.isSelecting || oak.selectionIsEmpty
});



// Export all as a lump
export default {...exports};

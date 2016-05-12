//////////////////////////////
//  Actions for dealing with elements
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";

import utils from "./utils";

//////////////////////////////
//  Manipulating oak state
//////////////////////////////

export function startEditing(options) {
  return setAppState({ state: { editing: true }, ...options });
}

export function stopEditing(options) {
  return setAppState({ state: { editing: false }, ...options });
}


//////////////////////////////
//  Generic oak state manipulators
//  Consider making a specific sugar function instead of calling directly.
//////////////////////////////


export function setAppState(options = {}) {
  const {
    state: stateDeltas,
    actionName = "Set oak state", returnTransaction
  } = options;

  if (stateDeltas == null) die(oak, "setAppState", arguments, "`options.state` must be provided.");

  const originalState = oak.state;
  const newState = Object.assign({}, originalState, stateDeltas);

  function redo() {
    utils.setAppState(newState);
  }

  function undo() {
    utils.setAppState(originalState);
  }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });
  if (returnTransaction) return transaction;
  return oak.undoQueue.addTransaction(transaction);
}







// Export all as a lump
export default Object.assign({}, exports);

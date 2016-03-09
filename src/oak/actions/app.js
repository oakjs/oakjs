//////////////////////////////
//  Actions for dealing with elements
//////////////////////////////
"use strict";

import { die, dieIfMissing, dieIfOutOfRange } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import app from "../app";

//////////////////////////////
//  Manipulating app state
//////////////////////////////

export function startEditing(options) {
  return setAppState({ editing: true }, options);
}

export function stopEditing(options) {
  return setAppState({ editing: false }, options);
}


export function setAppState(stateDeltas, options = {}) {
  const { actionName = "Set app state", returnTransaction } = options;
  if (stateDeltas == null) die(app, "setAppState", arguments, "state object must be provided.");

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

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: "Change app state" });
  if (returnTransaction) return transaction;
  return app.undoQueue.addTransaction(transaction);
}




// Export all as a lump
export default Object.assign({}, exports);

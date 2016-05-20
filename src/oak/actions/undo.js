//////////////////////////////
//  Actions for manipulating undo state
//////////////////////////////
"use strict";

import Action from "oak-roots/Action";

import oak from "../oak";


//////////////////////////////
//  Selection
//////////////////////////////

export function undo() {
  return oak.undo()
}

export function redo() {
  return oak.redo()
}

new Action({
  id: "oak.undo", title: "Undo", shortcut: "Meta Z",
  handler: undo,
  enabled:()=>oak.canUndo
});

new Action({
  id: "oak.redo", title: "Redo", shortcut: "Meta Shift Z",
  handler: redo,
  enabled:()=>oak.canRedo
});

// Export all as a lump
export default Object.assign({}, exports);

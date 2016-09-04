//////////////////////////////
//  Actions for manipulating oak state.
//////////////////////////////
"use strict";

import Action from "oak-roots/Action";
import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";

import utils from "./utils";

//////////////////////////////
//  Editing page / project / section
//////////////////////////////

export function startEditing(options = {}) {
  const state = { editing: true };
  if (options.editContext) state.editContext = options.editContext;
  return setAppStateTransaction({ state, ...options });
}

export function stopEditing(options = {}) {
  const state = { editing: false };
  if (options.editContext) state.editContext = options.editContext;
  return setAppStateTransaction({ state, ...options });
}


new Action({
  id: "oak.startEditingPage", title: "Start Editing Page", shortcut: "Meta E",
  handler: ()=> startEditing({editContext:"page"}),
  visible:()=>!(oak.state.editing && oak.state.editContext === "page")
});

new Action({
  id: "oak.stopEditingPage", title: "Stop Editing Page", shortcut: "Meta E",
  handler: stopEditing,
  visible:()=>oak.state.editing && oak.state.editContext === "page"
});

new Action({
  id: "oak.startEditingSection", title: "Start Editing Section",
  handler: ()=> startEditing({editContext:"section"}),
  visible:()=>!(oak.state.editing && oak.state.editContext === "section")
});

new Action({
  id: "oak.stopEditingSection", title: "Stop Editing Section",
  handler: stopEditing,
  visible:()=>oak.state.editing && oak.state.editContext === "section"
});

new Action({
  id: "oak.startEditingProject", title: "Start Editing Project",
  handler: ()=> startEditing({editContext:"project"}),
  visible:()=>!(oak.state.editing && oak.state.editContext === "project")
});

new Action({
  id: "oak.stopEditingProject", title: "Stop Editing Project",
  handler: stopEditing,
  visible:()=>oak.state.editing && oak.state.editContext === "project"
});


//////////////////////////////
//  Generic oak state manipulators
//  Consider making a specific sugar function instead of calling directly.
//////////////////////////////


export function setAppStateTransaction(options = {}) {
  const {
    state,
    actionName = "Set app state", autoExecute
  } = options;

  if (state == null) die(oak, "setAppStateTransaction", arguments, "`options.state` must be provided.");

  const originalState = Object.assign({}, oak.state);
  const newState = Object.assign({}, originalState, state);

  function redo() { utils.replaceAppState(newState); }
  function undo() { utils.replaceAppState(originalState); }

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}







// Export all as a lump
export default Object.assign({}, exports);

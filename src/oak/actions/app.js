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
  if (options.editController) state.editController = options.editController;
  return setAppStateTransaction({ state, ...options });
}

export function stopEditing(options = {}) {
  const state = { editing: false };
  if (options.editController) state.editController = options.editController;
  return setAppStateTransaction({ state, ...options });
}


// Start/stop editing project
new Action({
  id: "oak.startEditingPage", title: "Start Editing Page", shortcut: "Meta E",
  handler: () => startEditing({editController:"Page"}),
  hidden:() => oak.state.editing && oak.state.editController === "Page"
});

new Action({
  id: "oak.stopEditingPage", title: "Stop Editing Page", shortcut: "Meta E",
  handler: stopEditing,
  hidden:() => !oak.state.editing || oak.state.editController !== "Page"
});


// Start/stop editing current section
// NOTE: this is not really working yet...
new Action({
  id: "oak.startEditingSection", title: "Start Editing Section",
  handler: () => startEditing({editController:"Section"}),
  disabled: () => true,
  hidden:() => oak.state.editing && oak.state.editController === "Section"
});

new Action({
  id: "oak.stopEditingSection", title: "Stop Editing Section",
  handler: stopEditing,
  disabled: () => true,
  hidden:() => !oak.state.editing || oak.state.editController !== "Section"
});


// Start/stop editing current project
// NOTE: this is not really working yet...
new Action({
  id: "oak.startEditingProject", title: "Start Editing Project",
  handler: () => startEditing({editController:"Project"}),
  disabled: () => true,
  hidden:() => oak.state.editing && oak.state.editController === "Project"
});

new Action({
  id: "oak.stopEditingProject", title: "Stop Editing Project",
  handler: stopEditing,
  disabled: () => true,
  hidden: () => !oak.state.editing || oak.state.editController !== "Project"
});


// Force-save the current editController.
export function saveCurrent(options = {}) {
  const controller = oak.editController;
  if (!controller) return;
  return controller.forceSave()
          .then( oak.updateSoon, oak.updateSoon);
}
new Action({
  id: "oak.saveCurrent",
  title: ()=> `Save ${oak.state.editController}`,
  handler: saveCurrent,
  hidden: () => !oak.state.editing || !oak.editController
});


// Force-save current project, section, page
export function saveAll(options = {}) {
  const promises = [
    oak.project && oak.project.forceSave(),
    oak.section && oak.section.forceSave(),
    oak.page && oak.page.forceSave(),
  ].filter(Boolean);

  return Promise.all(promises)
    .then( oak.updateSoon, oak.updateSoon);
}

new Action({
  id: "oak.saveAll",
  title: "Save All",
  handler: saveAll
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

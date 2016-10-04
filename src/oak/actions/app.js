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
//  Selecting page / project / section
//////////////////////////////

export function startSelecting(options = {}) {
  const state = { selecting: true };
  if (options.editController) state.editController = options.editController;
  return setAppStateTransaction({ state, ...options });
}

export function stopSelecting(options = {}) {
  const state = { selecting: false };
  if (options.editController) state.editController = options.editController;
  return setAppStateTransaction({ state, ...options });
}

export function toggleSelecting(options = {}) {
  const selecting = (options.selecting !== undefined ? options.selecting : !oak.isSelecting);
  const state = { selecting };
  if (options.editController) state.editController = options.editController;
  return setAppStateTransaction({ state, ...options });
}

// Start/stop selecting the current editController
new Action({
  id: "oak.startSelecting",
  title: "Edit",
  handler: startSelecting
});

new Action({
  id: "oak.stopSelecting",
  title: "Stop Selecting",
  handler: stopSelecting
});

new Action({
  id: "oak.toggleSelecting",
  title: () => oak.isSelecting ? "Stop Selecting" : "Edit",
  handler: toggleSelecting
});


// Start/stop selecting the the current page
new Action({
  id: "oak.startSelectingPage", title: "Start Selecting Page", shortcut: "Meta E",
  handler: () => startSelecting({editController:"Page"}),
  hidden:() => oak.isSelecting && oak.state.editController === "Page"
});

new Action({
  id: "oak.stopSelectingPage", title: "Stop Selecting Page", shortcut: "Meta E",
  handler: stopSelecting,
  hidden:() => !oak.isSelecting || oak.state.editController !== "Page"
});


// Start/stop selecting the current section
// NOTE: this is not really working yet...
new Action({
  id: "oak.startSelectingSection", title: "Start Selecting Section",
  handler: () => startSelecting({editController:"Section"}),
  disabled: () => true,
  hidden:() => oak.isSelecting && oak.state.editController === "Section"
});

new Action({
  id: "oak.stopSelectingSection", title: "Stop Selecting Section",
  handler: stopSelecting,
  disabled: () => true,
  hidden:() => !oak.isSelecting || oak.state.editController !== "Section"
});


// Start/stop selecting the current project
// NOTE: this is not really working yet...
new Action({
  id: "oak.startSelectingProject", title: "Start Selecting Project",
  handler: () => startSelecting({editController:"Project"}),
  disabled: () => true,
  hidden:() => oak.isSelecting && oak.state.editController === "Project"
});

new Action({
  id: "oak.stopSelectingProject", title: "Stop Selecting Project",
  handler: stopSelecting,
  disabled: () => true,
  hidden: () => !oak.isSelecting || oak.state.editController !== "Project"
});




//
//  Save actions for the current controllers.
//

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
  hidden: () => !oak.editController,
  active: () => oak.editControllerIsDirty
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

// Return the state for a component, as a portion of our global `oak state`.
export function getComponentState(componentPath) {
  if (componentPath == null) die(oak, "setComponentState", arguments, "`componentPath` must be provided.");
  return oak.state[componentPath];
}

export function setComponentState(componentPath, deltas, options = {}) {
  if (componentPath == null) die(oak, "setComponentState", arguments, "`componentPath` must be provided.");
  if (deltas == null) die(oak, "setComponentState", arguments, "`deltas` must be provided.");

  // merge state `deltas` passed in with current component state.
  const currentState = getComponentState(componentPath);
  const newState = Object.assign({}, currentState, deltas);

  // defer to setAppStateTransaction
  return setAppStateTransaction({ state: { [componentPath]: newState }, ...options });
}



export function setAppStateTransaction(options = {}) {
  const {
    state,
    actionName = "Set app state", autoExecute
  } = options;

  if (state == null) die(oak, "setAppStateTransaction", arguments, "`options.state` must be provided.");

  const currentState = Object.assign({}, oak.state);
  const newState = Object.assign({}, currentState, state);

  function redo() { utils.replaceAppState(newState); }
  function undo() { utils.replaceAppState(currentState); }

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}







// Export all as a lump
export default {...exports};

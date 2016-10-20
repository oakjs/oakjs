//////////////////////////////
//  Actions for manipulating oak state.
//////////////////////////////
"use strict";

import Action from "oak-roots/Action";
import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

//TODO: Importing `oak` here was breaking things on the server, not sure why...
//      Using oak global for now.
//import oak from "../oak";

import utils from "./utils";

//////////////////////////////
//  Selecting page / project / section
//////////////////////////////

export function startSelecting(options = {}) {
  return _updateSelectingTransaction({ selecting: true, actionName: "Start Selecting", ...options });
}

export function stopSelecting(options = {}) {
  return _updateSelectingTransaction({ selecting: false, actionName: "Stop Selecting", ...options });
}

export function toggleSelecting(options = {}) {
  return _updateSelectingTransaction(options);
}

// Update `selecting` for some controller, and possibly change the `editController` at the same time.
export function _updateSelectingTransaction(options = {}) {
  let {
    // default to switching controller `isSelecting` flag if `selecting` not specified.
    controller = oak.editController,
    selecting = !controller.isSelecting,
    actionName = "Set Selecting",
    autoExecute = true
  } = options;


  const originalController = oak.editController;
  const originalWasSelecting = originalController.isSelecting;

  // This is ugly because it also affects the originalController and the app state.
  function redo() {
    if (originalController !== controller) {
      utils.setComponentState(originalController, { selecting: false });
      utils.setAppState({ editController: controller.type });
    }
    utils.setComponentState(controller, { selecting })
  }

  function undo() {
    if (originalController !== controller) {
      utils.setComponentState(originalControlle, { selecting: originalWasSelecting });
      utils.setAppState({ editController: originalController.type });
    }
    utils.setComponentState(controller, { selecting: !selecting });
  }

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}


// Start/stop selecting the current editController
new Action({
  id: "oak.startSelecting",
  title: "Edit",
  handler: startSelecting,
  hidden: () => !oak.editController
});

new Action({
  id: "oak.stopSelecting",
  title: "Stop Selecting",
  handler: stopSelecting,
  hidden: () => !oak.editController
});

new Action({
  id: "oak.toggleSelecting",
  title: () => oak.editController && oak.editController.isSelecting ? "Stop Selecting" : "Start Selecting",
  handler: toggleSelecting
});


// Start/stop selecting the the current page
new Action({
  id: "oak.togglePageSelection",
  hidden:() => !oak.page,
  title: () => oak.state.editController === "Page" && oak.page.isSelecting ? "Stop Selecting Page" : "Start Selecting Page",
  shortcut: "Meta E",
  handler: () => toggleSelecting({ controller: oak.page }),
});

// Start/stop selecting the current section
// NOTE: this is not really working in the UI yet...
new Action({
  id: "oak.toggleSectionSelection",
  hidden:() => !oak.section,
  title: () => oak.state.editController === "Section" && oak.section.isSelecting ? "Stop Selecting Section" : "Start Selecting Section",
  handler: () => toggleSelecting({ controller: oak.section }),
});

// Start/stop selecting the current project
// NOTE: this is not really working in the UI yet...
new Action({
  id: "oak.toggleProjectSelection",
  hidden:() => !oak.project,
  title: () => oak.state.editController === "Project" && oak.project.isSelecting ? "Stop Selecting Project" : "Start Selecting Project",
  handler: () => toggleSelecting({ controller: oak.project }),
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
  active: () => oak.editController && oak.editController.isDirty
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
export function getComponentState(componentPath, defaultValue) {
  if (componentPath == null) die(oak, "getComponentState", arguments, "`componentPath` must be provided.");
  return utils.getComponentState(componentPath, defaultValue);
}

export function setComponentStateTransaction(componentPath, deltas, options = {}) {
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

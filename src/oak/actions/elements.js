//////////////////////////////
//  Actions for dealing with elements
//////////////////////////////

import Action from "oak-roots/Action";
import { die } from "oak-roots/util/die";
import UndoQueue, { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";
import JSXElement from "../JSXElement";

import utils from "./utils";


// Set to `true` to debug adding/removing elements
const DEBUG = false;

//////////////////////////////
//  Manipulating element properties
//////////////////////////////


// Change a map of prop `props` of one or more `elements`.
// You can specify an `oid` string or a `JSXElement` or an array of same.
//
// Required options:  `elements`, `props`
// Optional options:  `controller`, `autoExecute`, `actionName`
//
// NOTE: throws if `elements` are not found in `controller`.
export function setElementProps(options) {
  const {
   controller, elements, props,
    actionName = "Set Properties", autoExecute
  } = options;

  if (props == null) die(oak, actionName, options, "`options.props` must be an object");

  return changeFragmentTransaction({
    actionName,
    controller,
    autoExecute,
    transformer: (fragment) => {
      fragment.setProps(props, elements);
    },
  });
}



// Change all props of `elements` to new `props` passed in.
// You can specify an `oid` string or a `JSXElement`.
//
// Required options:  `elements`, `props`
// Optional options:  `controller`, `autoExecute`, `actionName`
//
// NOTE: throws if `elements` are not found in `controller`.
export function resetElementProps(options) {
  const {
    controller, elements, props,
    actionName = "Set Properties", autoExecute
  } = options;

  if (props == null) die(oak, actionName, options, "`options.props` must be an object");

  return changeFragmentTransaction({
    actionName,
    controller,
    autoExecute,
    transformer: (fragment) => {
      fragment.resetProps(props, elements);
    },
  });
}



//////////////////////////////
//  Removing children
//////////////////////////////

// Remove list of `elements` passed as `oid` string or by reference from the `controller`.
//
// Required options:  `elements`
// Optional options:  `controller`, `autoExecute`, `actionName`
//
// NOTE: You cannot reliably use this to remove non-element children,
//       use `removeChildrenAtPositions()` instead.
export function removeElements(options = {}) {
  const {
    controller, elements = oak.selectedComponents,
    actionName = "Delete Elements", autoExecute
  } = options;

  if (!Array.isArray(elements)) die(oak, actionName, options, "`options.elements` must be an array");

  return changeFragmentTransaction({
    actionName,
    controller,
    autoExecute,
    transformer: (fragment) => {
      // remove the descendents of the elements or we'll get an error removing children
      const roots = fragment._removeDescendents(elements);
      fragment.removeElements(roots);
    }
  });
}

new Action({
  id: "oak.removeElements", title: "Delete", shortcut: "Meta Backspace",
  handler: removeElements,
  disabled: () => oak.selectionIsEmpty
});


//////////////////////////////
//  Adding children
//////////////////////////////


// Add list of `elements` and all descendents to `parent` at `position`,
// pushing other things out of the way.
//
// NOTE: this does NOT clone or otherwise modify the elements!
//
// Required options:  `parent`, `position`, `elements`
// Optional options:  `controller`, `autoExecute`, `actionName`
export function addElements(options = {}) {
  const {
    controller, parent, position, elements, autoSelect,
    actionName = "Add Elements", autoExecute
  } = options;

  if (!Array.isArray(elements)) die(oak, actionName, options, "`options.elements` must be an array");

  return changeFragmentTransaction({
    actionName,
    controller,
    autoSelect,
    autoExecute,
    transformer: (fragment) => {
      return fragment.add(parent, position, elements);
    }
  });
}



//////////////////////////////
//  Generic JSXFragment manipulation
//////////////////////////////


// Create a transaction for a transformation of `props` of one or more elements.
//  We'll call `options.transformer(jsxFragmentClone)` to make the actual change.
//  If `autoSelect` is true, we'll automatically select anything returned by the `transformer`.
//
// NOTE: don't call this directly, use one of the `setElement*()` or `*Element()` calls.
export function changeFragmentTransaction({
  controller, transformer, autoSelect,
  actionName, autoExecute
}) {
  controller = utils.getControllerOrDie(controller, actionName);
  const originalFragment = controller.jsxFragment;
  const originalSelection = autoSelect && oak.selection;

  // clone the original fragment and transform it
  const newFragment = originalFragment.clone();
  const results = transformer(newFragment);
  const newSelection = autoSelect && results.map(element => element.oid);

  function redo() { return _setControllerFragment(controller, newFragment, newSelection) }
  function undo() { return _setControllerFragment(controller, originalFragment, originalSelection) }

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}

function _setControllerFragment(controller, fragment, selection) {
  controller.jsxFragment = fragment;
  controller.dirty(true);
  controller.onComponentChanged();
  if (selection) utils.setSelection(selection);
}




// Export all as a lump
export default Object.assign({}, exports);


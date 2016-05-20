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
// Optional options:  `context`, `autoExecute`, `actionName`
//
// NOTE: throws if `elements` are not found in `context`.
export function setElementProps(options) {
  const {
   context, elements, props,
    actionName = "Set Properties", autoExecute
  } = options;

  if (props == null) die(oak, actionName, options, "`options.props` must be an object");

  return changeFragmentTransaction({
    actionName,
    context,
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
// Optional options:  `context`, `autoExecute`, `actionName`
//
// NOTE: throws if `elements` are not found in `context`.
export function resetElementProps(options) {
  const {
    context, elements, props,
    actionName = "Set Properties", autoExecute
  } = options;

  if (props == null) die(oak, actionName, options, "`options.props` must be an object");

  return changeFragmentTransaction({
    actionName,
    context,
    autoExecute,
    transformer: (fragment) => {
      fragment.resetProps(props, elements);
    },
  });
}



//////////////////////////////
//  Removing children
//////////////////////////////

// Remove list of `elements` passed as `oid` string or by reference from the `context`.
//
// Required options:  `elements`
// Optional options:  `context`, `autoExecute`, `actionName`
//
// NOTE: You cannot reliably use this to remove non-element children,
//       use `removeChildrenAtPositions()` instead.
export function removeElements(options = {}) {
  const {
    context, elements = oak.selectedComponents,
    actionName = "Delete Elements", autoExecute
  } = options;

  if (!Array.isArray(elements)) die(oak, actionName, options, "`options.elements` must be an array");

  return changeFragmentTransaction({
    actionName,
    context,
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
  enabled:()=>!oak.nothingSelected
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
// Optional options:  `context`, `autoExecute`, `actionName`
export function addElements(options = {}) {
  const {
    context, parent, position, elements,
    actionName = "Add Elements", autoExecute
  } = options;

  if (!Array.isArray(elements)) die(oak, actionName, options, "`options.elements` must be an array");

  return changeFragmentTransaction({
    actionName,
    context,
    autoExecute,
    transformer: (fragment) => {
      fragment.add(parent, position, elements);
    }
  });
}



//////////////////////////////
//  Generic JSXFragment manipulation
//////////////////////////////


// Create a transaction for a transformation of `props` of one or more elements.
//  We'll call `options.transformer(jsxFragmentClone)` to make the actual change.
//
// NOTE: don't call this directly, use one of the `setElement*()` or `*Element()` calls.
export function changeFragmentTransaction({
  context, transformer,
  actionName, autoExecute
}) {
  const controller = utils.getControllerOrDie(context, actionName);
  const originalFragment = controller.jsxFragment;

  // clone the original fragment and transform it
  const newFragment = originalFragment.clone();
  transformer(newFragment);

  function redo() { return _setControllerFragment(controller, newFragment) }
  function undo() { return _setControllerFragment(controller, originalFragment) }

  return new UndoTransaction({
    redoActions:[redo],
    undoActions:[undo],
    actionName,
    autoExecute
  });
}

function _setControllerFragment(controller, fragment) {
  controller.jsxFragment = fragment;
  controller.dirty(true);
  controller.onComponentChanged();
}




// Export all as a lump
export default Object.assign({}, exports);


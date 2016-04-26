//////////////////////////////
//  Actions for dealing with elements
//////////////////////////////

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
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: throws if `elements` are not found in `context`.
export function setElementProps(options) {
  const {
   context, elements, props,
    operation = "setElementProps", returnTransaction
  } = options;

  if (props == null) die(oak, operation, options, "`options.props` must be an object");

  return _changeElementTransaction({
    actionName: "Set Properties",
    context,
    operation,
    returnTransaction,
    transformer: (fragment) => {
      fragment.setProps(props, elements);
    },
  });
}



// Change all props of `elements` to new `props` passed in.
// You can specify an `oid` string or a `JSXElement`.
//
// Required options:  `elements`, `props`
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: throws if `elements` are not found in `context`.
export function resetElementProps(options) {
  const {
    context, elements, props,
    operation = "resetElementProps", returnTransaction
  } = options;

  if (props == null) die(oak, operation, options, "`options.props` must be an object");

  return _changeElementTransaction({
    actionName: "Set Properties",
    context,
    operation,
    returnTransaction,
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
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: You cannot reliably use this to remove non-element children,
//       use `removeChildrenAtPositions()` instead.
export function removeElements(options) {
  const {
    context, elements = oak.selectedComponents,
    operation = "removeElements", returnTransaction
  } = options;

  if (elements == null) die(oak, operation, options, "`options.elements` must be an object or array");

  return _changeElementTransaction({
    actionName: "Remove Elements",
    context,
    operation,
    returnTransaction,
    transformer: (fragment) => {
//      fragment.removeElements(elements);
      // remove the descendents of the elements or we'll get an error removing children
      const roots = fragment._removeDescendents(elements);
      fragment.removeElements(elements);
    }
  });
}


//////////////////////////////
//  Adding children
//////////////////////////////


// Add list of `elements` and all descendents to `parent` at `position`,
// pushing other things out of the way.
//
// NOTE: this does NOT clone or otherwise modify the elements!
//
// Required options:  `parent`, `position`, `elements`
// Optional options:  `context`, `returnTransaction`, `operation`, `keepOids`
export function addElements(options) {
  const {
    context, parent, position, elements,
    operation = "addChildrenToElement", returnTransaction
  } = options;

  if (elements == null) die(oak, operation, options, "`options.elements` must be an object or array");

  return _changeElementTransaction({
    actionName: "Add Elements",
    context,
    operation,
    returnTransaction,
    transformer: (fragment) => {
      fragment.add(parent, position, roots);
    }
  });
}



//////////////////////////////
//  Generic manipulation
//////////////////////////////


// Create a transaction for a transformation of `props` of one or more elements which MUST NOT:
//  - affect `children`
//  - affect `_parent`
//
//  We'll call `options.transformer(jsxFragmentClone)`.
//
// If `returnTransaction` is truthy, we'll return the transaction created.
// If not, we'll add it to the `oak.undoQueue`, which will execute it immeditately.
//
// NOTE: don't call this directly, use one of the `setElementProp()` calls.
function _changeElementTransaction({
  context, transformer,
  actionName, returnTransaction, operation
}) {
  const loader = utils.getLoaderOrDie(context, operation);
  const originalFragment = loader.jsxFragment;

  // clone the original fragment and transform it
  const newFragment = originalFragment.clone();
  transformer(newFragment);

  function redo() { return _setLoaderFragment(loader, newFragment) }
  function undo() { return _setLoaderFragment(loader, originalFragment) }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });

  if (returnTransaction) return transaction;
  return oak.undoQueue.addTransaction(transaction);
}

function _setLoaderFragment(loader, fragment) {
  loader.jsxFragment = fragment;
  loader.onComponentChanged();
}





// Export all as a lump
export default Object.assign({}, exports);


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
// Optional options:  `context`, `returnTransaction`, `actionName`
//
// NOTE: throws if `elements` are not found in `context`.
export function setElementProps(options) {
  const {
   context, elements, props,
    actionName = "Set Properties", returnTransaction
  } = options;

  if (props == null) die(oak, actionName, options, "`options.props` must be an object");

  return utils.changeFragmentTransaction({
    actionName,
    context,
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
// Optional options:  `context`, `returnTransaction`, `actionName`
//
// NOTE: throws if `elements` are not found in `context`.
export function resetElementProps(options) {
  const {
    context, elements, props,
    actionName = "Set Properties", returnTransaction
  } = options;

  if (props == null) die(oak, actionName, options, "`options.props` must be an object");

  return utils.changeFragmentTransaction({
    actionName,
    context,
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
// Optional options:  `context`, `returnTransaction`, `actionName`
//
// NOTE: You cannot reliably use this to remove non-element children,
//       use `removeChildrenAtPositions()` instead.
export function removeElements(options) {
  const {
    context, elements = oak.selectedComponents,
    actionName = "Delete Elements", returnTransaction
  } = options;

  if (!Array.isArray(elements)) die(oak, actionName, options, "`options.elements` must be an array");

  return utils.changeFragmentTransaction({
    actionName,
    context,
    returnTransaction,
    transformer: (fragment) => {
      // remove the descendents of the elements or we'll get an error removing children
      const roots = fragment._removeDescendents(elements);
      fragment.removeElements(roots);
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
// Optional options:  `context`, `returnTransaction`, `actionName`
export function addElements(options) {
  const {
    context, parent, position, elements,
    actionName = "Add Elements", returnTransaction
  } = options;

  if (!Array.isArray(elements)) die(oak, actionName, options, "`options.elements` must be an array");

  return utils.changeFragmentTransaction({
    actionName,
    context,
    returnTransaction,
    transformer: (fragment) => {
      fragment.add(parent, position, elements);
    }
  });
}


// Export all as a lump
export default Object.assign({}, exports);


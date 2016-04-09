//////////////////////////////
//  Actions for dealing with elements
//////////////////////////////

import { die } from "oak-roots/util/die";
import UndoQueue, { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";
import JSXElement, { OidRef } from "../JSXElement";

import utils from "./utils";


//////////////////////////////
//  Manipulating element properties
//////////////////////////////


// Set `prop[key]` of `element` to `value`.
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// Required options:  `element`, `key`, `value`
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: throws if `oid` or `OidRef` `element` is not found in `context`.
export function setElementProp(options) {
  const {
    context, element, key, value,
    operation = "setElementProp", returnTransaction
  } = options;

  if (typeof key !== "string") die(oak, operation, options, "`options.key` must be a string");

  const transactionOptions = {
    actionName: "Set Property",
    context,
    element,
    key,
    value,
    operation,
    returnTransaction,
    transformer: (clone) => {
      clone.props = Object.assign({}, clone.props, { [key]: value });
      return clone
    },
  }
  return _changeElementTransaction(transactionOptions);
}


// Change a map of prop `deltas` of an `element`.
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// Required options:  `element`, `deltas`
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: throws if `oid` or `OidRef` `element` is not found in `context`.
export function setElementProps({
  context, element, deltas,
  operation = "setElementProps", returnTransaction
}) {
  if (deltas == null) die(oak, operation, options, "`options.deltas` must be an object");

  const transactionOptions = {
    actionName: "Set Properties",
    context,
    element,
    deltas,
    operation,
    returnTransaction,
    transformer: (clone) => {
      clone.props = Object.assign({}, clone.props, options.deltas);
      return clone;
    },
  }
  return _changeElementTransaction(transactionOptions);
}



// Change all props of `element` to new `props` passed in.
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// Required options:  `element`, `props`
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: throws if `oid` or `OidRef` `element` is not found in `context`.
export function resetElementProps({
  context, element, props,
  operation = "setElementProps", returnTransaction
}) {
  if (deltas == null) die(oak, operation, options, "`options.deltas` must be an object");

  const transactionOptions = {
    actionName: "Set Properties",
    context,
    element,
    deltas,
    operation,
    returnTransaction,
    transformer: (clone) => {
      clone.props = Object.assign({}, options.props);
      return clone;
    },
  }
  return _changeElementTransaction(transactionOptions);
}




//////////////////////////////
//  Moving elements in the same context
//////////////////////////////



// Move a single `element` to new `targetParent` at `targetPosition`,
//  pushing other elements out of the way.
//
// Required options:  `element`, `targetParent`, `targetPosition`
// Optional options:  `context`, `returnTransaction`, `operation`
//
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// NOTE: You cannot reliably use this to move a non-element child,
//       use `moveChildAtPosition()` instead.
export function moveElement({
  context, element: _element, targetParent, targetPosition,
  operation = "moveElement", returnTransaction
}) {
  const loader = utils.getLoaderOrDie(context, operation);
  const element = utils.getElementOrDie(loader, _element, operation);
  const sourceParent = utils.getElementOrDie(loader, element._parent, operation);
  const sourcePosition = utils.getElementPositionOrDie(sourceParent, element, operation);

  const moveChildOptions = {
    context: loader,
    element,
    sourceParent,
    sourcePosition,
    targetParent,
    targetPosition,
    operation,
    returnTransaction
  }

  // delegate to `moveChildAtPosition()` to actually do the move
  return moveChildAtPosition(moveChildOptions);
}

// Move item at `sourcePosition` in `sourceParent` to `targetPosition` in `targetParent`
//
// Required options:  `sourceParent`, `sourcePosition`, `targetParent`, `targetPosition`,
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: `sourceParent` MAY be the same as `targetParent`.
//
// NOTE: `sourceParent` and `targetParent` MUST be in the same `context`.
//
// NOTE: This method is called out specially because we don't have to worry about
//       manipulating element descendents or changing oids...
export function moveChildAtPosition({
  context, sourceParent, sourcePosition, targetParent, targetPosition:_targetPosition,
  operation = "moveChildAtPosition", returnTransaction
}) {

  const loader = utils.getLoaderOrDie(context, operation);

  const originalSourceParent = utils.getElementOrDie(loader, sourceParent, operation);
  // if no target specified, they're moving within the source parent
  const originalTargetParent = targetParent
                             ? utils.getElementOrDie(loader, targetParent, operation)
                             : originalSourceParent;
  const originalChild = utils.getChildAtPositionOrDie(loader, originalSourceParent, sourcePosition, operation);

  const sameParent = (originalSourceParent === originalTargetParent);

  const newSourceParent = originalSourceParent.clone();
  const newTargetParent = (sameParent ? newSourceParent : originalTargetParent.clone());
  const targetPosition = (_targetPosition !== undefined ? _targetPosition : newTargetParent.childCount);
  const newChild = utils.cloneOrDie(originalChild, operation);

  // if we're adding to the same parent, position may change because of the delete
  const deleteDelta = (sameParent && (targetPosition > sourcePosition)) ? -1 : 0;
  utils.removeChildAtPositionOrDie(newSourceParent, sourcePosition);
  utils.addChildAtPositionOrDie(newTargetParent, targetPosition + deleteDelta, newChild, operation);

  const transactionOptions = {
    actionName: "Move Element",
    loader,
    originalItems: [originalChild, originalTargetParent, originalSourceParent],
    newItems: [newChild, newSourceParent, newTargetParent],
    returnTransaction
  }
  return _changeElementsTransaction(transactionOptions);
}



// Move a bunch of `elements` to new `targetParent` at `targetPosition`,
//  pushing other elements out of the way.
//
// Required options:  `elements`, `targetParent`, `targetPosition`
// Optional options:  `context`, `returnTransaction`, `operation`
//
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// NOTE: You cannot reliably use this to move a non-element child,
//       use `moveChildrenAtPosition()` instead.
export function moveElements({
  context, elements, targetParent, targetPosition,
  operation = "moveElements", returnTransaction
}) {

  const transactionOptions = {
    actionName: "Move Elements",
    list: elements,
    getItemTransaction: (element, index) => {
      return moveElement({
        context,
        element,
        targetParent,
        targetPosition: targetPosition + index,
        operation,
        returnTransaction: true
      });
    }
  }
  return _mapElementsTransaction(transactionOptions);
}





//////////////////////////////
//  Adding children to some context
//////////////////////////////


// Add `child` and all descendents to `parent` at `position`, pushing other things out of the way.
//
// Required options:  `parent`, `position`, `child`
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: This routine CHANGES THE OIDS of the `child` and all descendents.
//        If you're moving a node within the same tree and don't want to change oids,
//        use `moveElement()` instead.
export function addChildToElement({
  context, parent, position, child,
  operation = "addChildToElement", returnTransaction
}) {
  if (child == null) die(oak, operation, child, "Child must not be null");
  if (child instanceof OidRef) die(oak, operation, child, "Child must not be an OidRef");

  const loader = utils.getLoaderOrDie(context, operation);

  const originalParent = utils.getElementOrDie(loader, parent, operation);
  const originalItems = [ originalParent ];

  const newParent = originalParent.clone();
  let newChild, newDescendents;

  // clone JSXElements AND ALL DESCEDNENTS and give them new oids
  if (child instanceof JSXElement) {
    const descendents = child.getDescendentElements();
    [newChild, ...newDescendents] = utils.cloneAndGenerateNewOids(loader, [child, ...descendents]);
  }
  else {
    newChild = utils.cloneOrDie(child, operation);
  }

  utils.addChildAtPositionOrDie(newParent, position, newChild, operation);

  const transactionOptions = {
    actionName: "Add Element",
    loader,
    originalItems: [ originalParent ],
    newItems: [ newParent, newChild, newDescendents ],
    returnTransaction
  }

  return _changeElementsTransaction(transactionOptions);
}



//////////////////////////////
//  Adding children to some context
//////////////////////////////

// Remove child at `position` from `parent`.
// NOTE: also removes all descendent elements!
export function removeChildAtPosition({
  context, parent, position,
  operation = "removeChildAtPosition", returnTransaction
}) {
  const loader = utils.getLoaderOrDie(context, operation);

  const originalParent = utils.getElementOrDie(loader, parent, operation);
  const originalChild = utils.getChildAtPositionOrDie(loader, originalParent, position, operation);
  const originalDescendents = utils.getDescendentElements(originalChild);

  const newParent = originalParent.clone();
  utils.removeChildAtPositionOrDie(newParent, position);

  const transactionOptions = {
    actionName: "Remove Element",
    loader,
    originalItems: [ originalChild, originalDescendents, originalParent ],
    newItems: [ newParent ],
    returnTransaction
  }

  return _changeElementsTransaction(transactionOptions);
}

// Remove a `element` passed as `oid` string, `OidRef` or by reference from the `context`.
//
// Required options:  `element`
// Optional options:  `context`, `returnTransaction`, `operation`
//
// NOTE: You cannot reliably use this to remove a non-element child,
//       use `removeChildAtPosition()` instead.
export function removeElement({
  context, element: _element,
  operation = "removeElement", returnTransaction
}) {
  const loader = utils.getLoaderOrDie(context, operation);
  const element = utils.getElementOrDie(loader, _element, operation);
  const parent = utils.getElementOrDie(loader, element._parent, operation);
  const position = utils.getElementPositionOrDie(parent, element, operation);

  const removeChildOptions = {
    actionName: "Remove Element",
    context: loader,
    element,
    parent,
    position,
    returnTransaction
  }

  return removeChildAtPosition(removeChildOptions);
}


// Remove list of `elements` passed as `oid` string, `OidRef` or by reference from the `context`.
//
// Optional options:  `context`, `elements`, `returnTransaction`, `operation`
//
// NOTE: You cannot reliably use this to remove non-element children,
//       use `removeChildrenAtPositions()` instead.
export function removeElements({
  context, elements = oak.selection,
  operation = "removeElements", returnTransaction
} = {}) {
  const transactionOptions = {
    actionName: "Remove Elements",
    list: elements,
    getItemTransaction: (element, index) => {
      return removeElement({
        context,
        element,
        operation,
        returnTransaction: true
      })
    }
  }
  return _mapElementsTransaction(transactionOptions);
}




//////////////////////////////
//  Utility functions to manipulate Loaders
//////////////////////////////

function addElementsToLoader(loader, elements) {
console.log("adding", elements, "to", loader);
  elements.forEach(element => {
    if (element instanceof JSXElement) {
      element.getElement = loader.getElement;
      loader.oids[element.oid] = element;
    }
    // recurse for arrays
    else if (Array.isArray(element) && element.length) {
      addElementsToLoader(loader, element);
    }
    // ignore everything else
  })
  loader.onComponentChanged();
  return elements;
}

function removeElementsFromLoader(loader, elements) {
console.log("removing", elements, "from", loader);
  elements.forEach(element => {
    if (element instanceof JSXElement) delete loader.oids[element.oid];
    // recurse for arrays
    else if (Array.isArray(element) && element.length) {
      removeElementsFromLoader(loader, element);
    }
  })
  loader.onComponentChanged();
  return elements;
}



//////////////////////////////
//  Undo action creators
//////////////////////////////


// Create a transaction for a transformation of a single element which MUST NOT:
//  - affect `_children`
//  - affect `_parent`
//
//  We'll call `transformer(<clone-of-element>)`.
//
// If `returnTransaction` is truthy, we'll return the transaction created.
// If not, we'll add it to the `oak.undoQueue`, which will execute it immeditately.
//
// NOTE: don't call this directly, use one of the `setElementProp()` calls.
function _changeElementTransaction({
  context, element,
  transformer,
  actionName, returnTransaction, operation
}) {
  const loader = utils.getLoaderOrDie(context, operation);
  const original = utils.getElementOrDie(loader, element, operation);

  const clone = transformer(original.clone(), loader);
  function redo() { return addElementsToLoader(loader, [clone]); }
  function undo() { return addElementsToLoader(loader, [original]); }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });

  if (returnTransaction) return transaction;
  return oak.undoQueue.addTransaction(transaction);
}


// Create a transaction for one of our `[add|move|remove]Element*()` calls.
//
// If `returnTransaction` is truthy, we'll return the transaction created.
// If not, we'll add it to the `oak.undoQueue`, which will execute it immeditately.
//
// NOTE: don't call this directly, use one of the `setElementProp()` calls.
//
// TODO: how will we return the things that have been added for selection?
function _changeElementsTransaction({
  loader, originalItems = [], newItems = [],
  actionName, returnTransaction
}) {
console.info("original", originalItems);
console.info("new", newItems);
  function redo() {
    removeElementsFromLoader(loader, originalItems);
    return addElementsToLoader(loader, newItems);
  }

  function undo() {
    removeElementsFromLoader(loader, newItems);
    return addElementsToLoader(loader, originalItems);
  }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });

  if (returnTransaction) return transaction;
  return oak.undoQueue.addTransaction(transaction);
}



// Create a transaction which maps `getTransaction` over a `list`,
//  gathering all subTransactions returned into a single transaction.
//
// If `returnTransaction` is truthy, we'll return the transaction created.
// If not, we'll add it to the `oak.undoQueue`, which will execute it immeditately.
//
// NOTE: don't call this directly.
function _mapElementsTransaction({ list, getItemTransaction, actionName, returnTransaction }) {
  const transaction = UndoQueue.mapTransactions(list, getItemTransaction, actionName, returnTransaction);

  if (returnTransaction) return transaction;
  return oak.undoQueue.addTransaction(transaction);
}






// Export all as a lump
export default Object.assign({}, exports);

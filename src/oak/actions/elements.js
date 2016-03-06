//////////////////////////////
//  Actions for dealing with elements
//////////////////////////////
"use strict";

import { die, dieIfMissing, dieIfOutOfRange } from "oak-roots/util/die";

import app from "../app";
import JSXElement, { JSXElementParser } from "../JSXElement";



//////////////////////////////
//  Manipulating element properties
//////////////////////////////


// Set `prop[key]` of `element` to `value`.
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// Required options:  `context`, `element`, `key`, `value`
// Optional options:  `returnTransaction`, `operation`
//
// NOTE: throws if `oid` or `OidRef` `element` is not found in `context`.
export function setElementProp(options) {
  const KEYS = ["context", "element", "key", "value", "operation"];
  const [ context, element, key, value, operation ]
    = getOptionsOrDie(options, "setElementProp", KEYS);

  const transactionOptions = {
    actionName: "Set Property",
    operation,
    ...options,
    transformer: (clone) => clone.props = Object.assign({}, clone.props, { [key]: value }),
  }
  return _changeElementTransaction(transactionOptions);
}


// Change a map of prop `deltas` of an `element`.
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// Required options:  `context`, `element`, `deltas`
// Optional options:  `returnTransaction`, `operation`
//
// NOTE: throws if `oid` or `OidRef` `element` is not found in `context`.
export function setElementProps(options) {
  const KEYS = ["context", "element", "deltas", "operation"];
  const [ context, element, deltas, operation ]
    = getOptionsOrDie(options, "setElementProps", KEYS);

  const transactionOptions = {
    actionName: "Set Properties",
    operation,
    ...options,
    transformer: (clone) => clone.props = Object.assign({}, clone.props, options.deltas),
  }
  return _changeElementTransaction(transactionOptions);
}



// Change all props of `element` to new `props` passed in.
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// Required options:  `context`, `element`, `props`
// Optional options:  `returnTransaction`, `operation`
//
// NOTE: throws if `oid` or `OidRef` `element` is not found in `context`.
export function resetElementProps(options) {) {
  const KEYS = ["context", "element", "props", "operation"];
  const [ context, element, props, operation ]
    = getOptionsOrDie(options, "resetElementProps", KEYS);

  const transactionOptions = {
    actionName: "Set Properties",
    operation,
    ...options,
    transformer: (clone) => clone.props = Object.assign({}, options.props),
  }
  return _changeElementTransaction(transactionOptions);
}




//////////////////////////////
//  Moving elements in the same context
//////////////////////////////



// Move a single `element` to new `targetParent` at `targetPosition`,
//  pushing other elements out of the way.
//
// Required options:  `context`, `element`, `targetParent`, `targetPosition`
// Optional options:  `returnTransaction`, `operation`
//
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// NOTE: You cannot reliably use this to move a non-element child,
//       use `moveChildAtPosition()` instead.
export function moveElement(options) {
  const KEYS = ["context", "element", "targetParent", "targetPosition", "operation"];
  const [ context, element, targetParent, targetPosition, operation ]
    = getOptionsOrDie(options, "moveElement", KEYS);

  const loader = getLoaderOrDie(context, operation);
  const original = getLoaderElementOrDie(loader, element, operation);
  const sourceParent = getLoaderElementOrDie(loader, original._parent, operation);
  const sourcePosition = getElementPositionOrDie(sourceParent, original, operation);

  const moveChildOptions = {
    actionName: "Move Element",
    operation,
    ...options,
    loader,
    original,
    sourceParent,
    sourcePosition,
  }

  // delegate to `moveChildAtPosition()` to actually do the move
  return moveChildAtPosition(moveChildOptions);
}


// Move a bunch of `elements` to new `targetParent` at `targetPosition`,
//  pushing other elements out of the way.
//
// Required options:  `context`, `elements`, `targetParent`, `targetPosition`
// Optional options:  `returnTransaction`, `operation`
//
// You can specify an `oid` string, an `OidRef` or a `JSXElement`.
//
// NOTE: You cannot reliably use this to move a non-element child,
//       use `moveChildrenAtPosition()` instead.
export function moveElements(options) {
  const KEYS = ["context", "elements", "targetParent", "targetPosition", "operation"];
  const [ context, elements, targetParent, targetPosition, operation ]
    = getOptionsOrDie(options, "moveElements", KEYS);

  const transactionOptions = {
    actionName: "Move Elements",
    operation,
    ...options,
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



// Move item at `sourcePosition` in `sourceParent` to `targetPosition` in `targetParent`
//
// Required options:  `context`, `sourceParent`, `sourcePosition`, `targetParent`, `targetPosition`,
// Optional options:  `returnTransaction`, `operation`
//
// NOTE: `sourceParent` MAY be the same as `targetParent`.
//
// NOTE: `sourceParent` and `targetParent` MUST be in the same `context`.
//
// NOTE: This method is called out specially because we don't have to worry about
//       manipulating element descendents or changing oids...
export function moveChildAtPosition(options) {
  const KEYS = ["context", "sourceParent", "sourcePosition", "targetParent", "targetPosition", "operation"];
  const [ context, sourceParent, sourcePosition, targetParent, targetPosition, operation ]
    = getOptionsOrDie(options, "moveChildAtPosition", KEYS);

  const loader = getLoaderOrDie(context, operation);

// TODO: if source and target are the same...
  const originalSourceParent = getElementOrDie(loader, sourceParent, operation);
  const originalTargetParent = getElementOrDie(loader, targetParent, operation);
  const originalChild = getChildAtPositionOrDie(loader, originalSourceParent, sourcePosition, operation);

  const sameParent = (originalSourceParent === originalTargetParent);

  const newSourceParent = originalSourceParent.clone();
  const newTargetParent = (sameParent ? newSourceParent : originalTargetParent.clone());
  const newChild = cloneOrDie(originalChild, operation);

  // if we're adding to the same parent, position may change because of the delete
  const deleteDelta = (sameParent && targetPosition > sourcePosition) -1 : 0;
  removeChildAtPositionOrDie(newSourceParent, sourcePosition);
  addChildAtPositionOrDie(newTargetParent, targetPosition + deleteDelta, newChild, operation);

  const transactionOptions = {
    actionName: "Move Element",
    operation,
    ...options,
    loader,
    originalItems: [originalChild, originalTargetParent, originalSourceParent],
    newItems: [newChild, newSourceParent, newTargetParent]
  }
  return _changeElementsTransaction(transactionOptions);
}




//////////////////////////////
//  Adding children to some context
//////////////////////////////


// Add `child` and all descendents to `parent` at `position`, pushing other things out of the way.
//
// Required options:  `context`, `parent`, `position`, `child`
// Optional options:  `returnTransaction`, `operation`
//
// NOTE: This routine CHANGES THE OIDS of the `child` and all descendents.
//        If you're moving a node within the same tree and don't want to change oids,
//        use `moveElement()` instead.
export function addChildToElement(options) {
  const KEYS = ["context", "parent", "position", "child", "operation"];
  const [ context, parent, position, child, operation ]
    = getOptionsOrDie(options, "addChildToElement", KEYS);

  if (child == null) die(app, operation, child, "Child must not be null");
  if (child instanceof OidRef) die(app, operation, child, "Child must not be an OidRef");

  const loader = getLoaderOrDie(context, operation);

  const originalParent = getElementOrDie(loader, parent, operation);
  const originalItems = [ originalParent ];

  const newParent = originalParent.clone();
  let newChild, newDescendents;
  const newItems = [ newParent ];

  // clone JSXElements AND ALL DESCEDNENTS and give them new oids
  if (child instanceof JSXElement) {
    const descendents = child.getDescendentElements();
    [newChild, ...newDescendents] = cloneAndGenerateNewOids(loader, [child, ...descendents]);
  }
  else {
    newChild = cloneOrDie(child, operation);
  }

  newItems.push(newChild, newDescendents);
  addChildAtPositionOrDie(newParent, position, newChild, operation);

  const transactionOptions = {
    actionName: "Add Element",
    operation,
    ...options,
    loader,
    originalItems,
    newItems
  }

  return _changeElementsTransaction(transactionOptions);
}




// Remove a `element` passed as `oid` string, `OidRef` or by reference from the `context`.
//
// Required options:  `context`, `element`
// Optional options:  `returnTransaction`, `operation`
//
// NOTE: You cannot reliably use this to remove a non-element child,
//       use `removeChildAtPosition()` instead.
export function removeElement(options) {
  const KEYS = ["context", "element", "operation"];
  const [ context, element: _element, operation ]
    = getOptionsOrDie(options, "removeElement", KEYS);

  const loader = getLoaderOrDie(context, "removeElement");

  const element = getLoaderElementOrDie(loader, _element, "removeElement");
  const parent = getLoaderElementOrDie(loader, element._parent, "removeElement");
  const position = getElementPositionOrDie(parent, element, "removeElement");

  const removeChildOptions = {
    actionName: "Remove Element",
    operation,
    ...options,
    loader,
    element,
    parent,
    position
  }

  return removeChildAtPosition(removeChildOptions);
}


// Remove a `element` passed as `oid` string, `OidRef` or by reference from the `context`.
//
// Required options:  `context`, `element`
// Optional options:  `returnTransaction`, `operation`
//
// NOTE: You cannot reliably use this to remove a non-element children,
//       use `removeChildrenAtPositions()` instead.
export function removeElements(options) {
  const KEYS = ["context", "elements", "operation"];
  const [ context, elements, operation ]
    = getOptionsOrDie(options, "removeElements", KEYS);

  const transactionOptions = {
    actionName: "Remove Elements",
    operation,
    ...options,
    list: elements,
    getItemTransaction: (element, index) => {
      return removeElement({
        context,
        element,
        operation,
        returnTransaction: true
      });
  }
  return _mapElementsTransaction(transactionOptions);
}



// Remove child at `position` from `parent`.
// NOTE: also removes all descendent elements!
export function removeChildAtPosition(options) {
  const KEYS = ["context", "parent", "position", "operation"];
  const [ context, parent, position, operation ]
    = getOptionsOrDie(options, "removeElement", KEYS);

  const loader = getLoaderOrDie(context, "removeChildAtPosition");

  const originalParent = getElementOrDie(loader, parent, "removeChildAtPosition");
  const originalChild = getChildAtPositionOrDie(loader, originalParent, position, "removeChildAtPosition");
  const originalDescendents = getDescendentElements(originalChild);

  const newParent = originalParent.clone();
  removeChildAtPositionOrDie(newParent, position);

  const transactionOptions = {
    actionName: "Remove Element",
    operation,
    ...options,
    loader,
    originalItems: [ originalChild, originalDescendents, originalParent ]
    newItems: [ newParent ]
  }

  return _changeElementsTransaction(transactionOptions);
}



//////////////////////////////
//  Utility functions to manipulate Loaders
//////////////////////////////

function addElementsToLoader(loader, elements) {
  elements.forEach(element => {
    if (element instanceof JSXElement) {
      element.getElement = loader.getElement;
      loader.oids[element.oid] = element;
    }
    // recurse for arrays
    else if (Array.isArray(element) {
      addElementsToLoader(loader, element);
    }
    // ignore everything else
  })
}

function removeElementsFromLoader(loader, elements) {
  elements.forEach(element => {
    if (element instanceof JSXElement) delete loader.oids[element.oid];
  })
}

//////////////////////////////
//  Utility functions to manipulate JSXElements
//////////////////////////////


function setChildAtPositionOrDie(parent, position, child, operation) {
  dieIfPositionOutOfRange(app, operation, parent._children, position);
  _setChildAtPosition(parent, position, child);
}

function addChildAtPositionOrDie(parent, position, child, operation) {
  if (parent._children) parent._children = [];
  if (position === null) {
    position = parent._children.length;
  } else {
    dieIfPositionOutOfRange(app, operation, parent._children, position, position._children.length);
  }
  parent._children.splice(position, 0, undefined);
  _setChildAtPosition(parent, position, child);
}

function _setChildAtPosition(parent, position, child) {
  if (child instanceof JSXElement) {
    parent._children[position] = child.getReference();
    child._parent = parent.oid;
  }
  else {
    parent._children[position] = child;
  }
}

function removeChildAtPositionOrDie(parent, position, operation) {
  dieIfPositionOutOfRange(app, operation, parent._children, position);
  parent._children.splice(position, 1);
}

// Generate new `oids` for all `elements`, assumed to be clones of JSXElements, thus OK to change.
// Update `_parent` and `_children` as well, but doesn't worry about elements that weren't included.
// NOTE: It's not really safe to use this with elements that arent' in the same tree,
//       which we assume to be rooted at the first element.
function cloneAndGenerateNewOids(loader, elements) {
  // first make a map of { currentOid => [<originalElement> or <newOid>] }
  const map = Object.assign({}, loader.oids);
  const clones = elements.map(element {
    const clone = element.clone();
    const oldOid = element.oid;
    const newOid = JSXElement.getUniqueOid(map);
    clone.attributes.oid = newOid;
    map[oldOid] = newOid;
  })

  function getMappedOid(oldOid, errorMessage, element) {
    const mapItem = map[oldOid];
    if (!mapItem) {
      if (errorMessage) console.warn(`ERROR: getMappedOid(${oid}): ${errorMessage} for element:`, element, " and map:", map);
      return undefined;
    if (typeof mapItem === "string") return mapItem;
    return mapItem.oid;
  }

  // update the `_parent` and `_children` for each clone
  clones.forEach(clone => {
    clone._parent = getMappedOid(clone._parent, "parent oid not found", clone);
    if (clone._children) clone._children.forEach(child, index => {
      if (child instanceof OidRef) {
        newOid = getMappedOid(child.oid, "child OidRef not found", child);
        if (newOid) child[index] = new OidRef(newOid);
      }
    });
  });

  return clones;
}

function getDescendentElements(element) {
  if (!(element instanceof JSXElement)) return [];
  return element.getDescendentElements();
}

function getChildOid(child) {
  if (typeof child === "string") return child;
  if (child && (child instanceof OidRef || child instanceof JSXElement)) return child.oid;
}

//////////////////////////////
//  Guards
//////////////////////////////

function getLoaderOrDie(pathOrController, operation) {
  if (loader instanceof ComponentLoader) return loader;
  const loader = app.getLoader(pathOrController);
  if (!loader) die(app, operation, pathOrController, "Couldn't get controller -- is this a valid path?");
  return loader;
}

function getElementOrDie(loader, oid, operation) {
  const element = loader.getElement(oid);
  if (!element) die(app, operation, [loader, oid], "Element not found");
  if (!(element instanceof JSXElement)) die(app, operation, [loader, oid, element], "Expected a JSXElement");
  if (element.getElement !== loader.getElement) die(app, operation, [loader, oid, element], "Element doesn't belong to loader");
  return element;
}

function getChildAtPositionOrDie(loader, parent, position, operation) {
  dieIfPositionOutOfRange(app, operation, parent._children, position);
  const child = parent._children[position];
  if (child instanceof OidRef) return loader.getElement(child);
  return child;
}

// If `child` is a `JSXElement`, return a clone.
// If an `OidRef` or `null`, throw.
// Otherwise return the `child` passed in (assuming its a lieral or something else unclonable).
function cloneOrDie(child, operation) {
// TODO: don't allow "" ???
  if (child == null) die(app, operation, child, "Child must not be null");
  if (child instanceof OidRef) die(app, operation, child, "Child must not be an OidRef");
  if (child instanceof JSXElement) return child.clone();
//TODO: use generic `clone()` ???
  return child;
}

// Given a `loader` and an `element` as a `oid`, `OidRef` or `JSXElement`,
//  return the version of that `element` that the `loader` knows about.
function getLoaderElementOrDie(loader, element, operation) {
  const oid = getChildOid(element);
  if (!oid) die(app, operation, element, "Element must be an oid string, OidRef or JSXElement");
  if (!loader.contains(oid)) die(app, operation, [loader, element], "Child not found in loader");
  return loader.oids[oid];
}

function getElementPositionOrDie(parent, element, operation) {
  const position = parent.getChildPosition(element);
  if (position === -1) die(app, "removeElement", arguments, "Child not found in parent. ???");
  return position;
}

function getOptionsOrDie(options, operation, keys) {
  if (!options) die(app, operation, options, "Required options object not passed");
  return keys.map(key => {
    if (!(key in options)) {
      if (key === "operation") return operation;
      die(app, operation, [options, key], `Required option '${key}' not passed`);
    }
    return options[key];
  });
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
// If not, we'll add it to the `app.undoQueue`, which will execute it immeditately.
//
// NOTE: don't call this directly, use one of the `setElementProp()` calls.
function _changeElementTransaction({ context, element, transformer, actionName, returnTransaction, operation }) {
  const loader = getLoaderOrDie(context, operation);
  const original = getElementOrDie(loader, element, operation);

  const clone = transformer(original.clone(), loader);

  function redo() { return addElementsToLoader(loader, clone); }
  function undo() { return addElementsToLoader(loader, element); }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });

  if (returnTransaction) return transaction;
  return app.UndoQueue.addTransaction(transaction);
}


// Create a transaction for one of our `[add|move|remove]Element*()` calls.
//
// If `returnTransaction` is truthy, we'll return the transaction created.
// If not, we'll add it to the `app.undoQueue`, which will execute it immeditately.
//
// NOTE: don't call this directly, use one of the `setElementProp()` calls.
//
// TODO: how will we return the things that have been added for selection?
function _changeElementsTransaction({ originalItems, newItems, actionName, returnTransaction }) {
  function redo() {
    if (onRedo.remove) removeElementsFromLoader(loader, ...onRedo.remove);
    if (onRedo.add) return addElementsToLoader(loader, ...onRedo.add);
  }

  function undo() {
    if (onUndo.remove) removeElementsFromLoader(loader, ...onUndo.remove);
    if (onUndo.add) return addElementsToLoader(loader, ...onUndo.add);
  }

  const transaction = new UndoTransaction({ redoActions:[redo], undoActions:[undo], name: actionName });

  if (returnTransaction) return transaction;
  return app.UndoQueue.addTransaction(transaction);
}



// Create a transaction which maps `getTransaction` over a `list`,
//  gathering all subTransactions returned into a single transaction.
//
// If `returnTransaction` is truthy, we'll return the transaction created.
// If not, we'll add it to the `app.undoQueue`, which will execute it immeditately.
//
// NOTE: don't call this directly.
function _mapElementsTransaction({ list, getItemTransaction, actionName, returnTransaction }) {
  const transaction = UndoQueue.mapTransactions(list, getTransaction, actionName);

  if (returnTransaction) return transaction;
  return app.UndoQueue.addTransaction(transaction);
}

//////////////////////////////
//  Utilities for dealing with elements
//////////////////////////////

import { die, dieIfMissing, dieIfOutOfRange } from "oak-roots/util/die";
import UndoQueue, { UndoTransaction } from "oak-roots/UndoQueue";

import JSXElement from "../JSXElement";

export function getOidOrDie(thing, operation) {
  if (typeof thing === "string") return thing;
  if (thing instanceof JSXElement) return thing.oid;
  die(oak, operation, thing, "Can't figure out oid!");
}

export function getOidsOrDie(_things, operation) {
  if (!_things || _things.length === 0) {
    die(oak, operation, _things, "You must provide at least one item");
  }
  const things = Array.isArray(_things) ? _things : [_things];
  return things.map(thing => getOidOrDie(thing, operation));
}


//////////////////////////////
//  Guards
//////////////////////////////

export function getLoaderOrDie(context = oak.editContext, operation) {
  const loader = oak.loader.getLoader(context);
  if (!loader) die(oak, operation, context, "Couldn't get loader -- is this a valid path?");
  return loader;
}

export function getFragmentOrDie(context, operation) {
  const loader = getLoaderOrDie(context, operation);
  return loader.jsxFragment;
}


//////////////////////////////
//  Generic JSXFragment manipulation
//////////////////////////////


// Create a transaction for a transformation of `props` of one or more elements.
//  We'll call `options.transformer(jsxFragmentClone)` to make the actual change.
//
// If `returnTransaction` is truthy, we'll return the transaction created.
// If not, we'll add it to the `oak.undoQueue`, which will execute it immeditately.
//
// NOTE: don't call this directly, use one of the `setElement*()` or `*Element()` calls.
export function changeFragmentTransaction({
  context, transformer,
  actionName, returnTransaction
}) {
  const loader = getLoaderOrDie(context, actionName);
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


// Export all in one go
export default Object.assign({}, exports);


//////////////////////////////
//  Utilities for dealing with elements
//////////////////////////////

import { die, dieIfMissing, dieIfOutOfRange } from "oak-roots/util/die";

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






// Export all in one go
export default Object.assign({}, exports);

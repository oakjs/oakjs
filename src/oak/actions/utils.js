//////////////////////////////
//  Utilities for dealing with elements
//////////////////////////////

import { die, dieIfMissing, dieIfOutOfRange } from "oak-roots/util/die";

import JSXElement, { OidRef } from "../JSXElement";


//////////////////////////////
//  Utility functions to manipulate JSXElements
//////////////////////////////


export function setChildAtPositionOrDie(parent, position, child, operation) {
  dieIfOutOfRange(oak, operation, parent._children, position);
  _setChildAtPosition(parent, position, child);
}

export function addChildAtPositionOrDie(parent, position, child, operation) {
  if (!parent._children) parent._children = [];
  if (position == null) {
    position = parent._children.length;
  } else {
    dieIfOutOfRange(oak, operation, parent._children, position, parent._children.length);
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

export function removeChildAtPositionOrDie(parent, position, operation) {
  dieIfOutOfRange(oak, operation, parent._children, position);
  parent._children.splice(position, 1);
}

// Generate new `oids` for all `elements`, assumed to be clones of JSXElements, thus OK to change.
// Update `_parent` and `_children` as well, but doesn't worry about elements that weren't included.
// NOTE: It's not really safe to use this with elements that arent' in the same tree,
//       which we assume to be rooted at the first element.
export function cloneAndGenerateNewOids(loader, elements) {
  // first make a map of { currentOid => [<originalElement> or <newOid>] }
  const map = Object.assign({}, loader.oids);
  const clones = elements.map(element => {
    const clone = element.clone();
    const oldOid = element.oid;
    const newOid = JSXElement.getUniqueOid(map);

    if (!clone.props) clone.props = {};
    clone.props.oid = newOid;

    map[oldOid] = newOid;

    return clone;
  })

  function getMappedOid(oldOid, errorMessage, element) {
    const mapItem = map[oldOid];
    if (!mapItem) {
      if (errorMessage) console.warn(`ERROR: getMappedOid(${oldOid}): ${errorMessage} for element:`, element, " and map:", map);
      return undefined;
    }
    if (typeof mapItem === "string") return mapItem;
    return mapItem.oid;
  }

  // update the `_parent` and `_children` for each clone
  clones.forEach(clone => {
    if (clone._parent) clone._parent = getMappedOid(clone._parent, "parent oid not found", clone);
    if (clone._children) clone._children.forEach( (child, index) => {
      if (child instanceof OidRef) {
        newOid = getMappedOid(child.oid, "child OidRef not found", child);
        if (newOid) child[index] = new OidRef(newOid);
      }
    });
  });

  return clones;
}

export function getDescendentElements(element) {
  if (!(element instanceof JSXElement)) return [];
  return element.getDescendentElements();
}

export function getOidOrDie(thing, operation) {
  if (typeof thing === "string") return thing;
  if (thing && (thing instanceof OidRef || thing instanceof JSXElement)) return thing.oid;
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

// Given a `loader`, return the element for specifeid
export function getElementOrDie(loader, _oid, operation, deltas) {
  // Normalize `_oid` to a string.
  const oid = JSXElement.getOid(_oid);
  if (!oid) die(oak, operation, [loader, _oid], "Invalid oid");

  // if they passed a list of existing deltas, check that first
  if (deltas && deltas[oid]) {
    return deltas[oid];
  }

  const element = loader.getElement(oid);
  if (!element) die(oak, operation, [loader, oid], "Element not found");
  if (!(element instanceof JSXElement)) die(oak, operation, [loader, oid, element], "Expected a JSXElement");
  if (element.getElement !== loader.getElement) die(oak, operation, [loader, oid, element], "Element doesn't belong to loader");
  return element;
}

export function getChildAtPositionOrDie(loader, parent, position, operation) {
  dieIfOutOfRange(oak, operation, parent._children, position);
  const child = parent._children[position];
  if (child instanceof OidRef) return loader.getElement(child);
  return child;
}

export function getElementPositionOrDie(parent, element, operation) {
  const position = parent.getChildPosition(element);
  if (position === -1) die(oak, "removeElement", arguments, "Child not found in parent. ???");
  return position;
}


// If `child` is a `JSXElement`, return a clone.
// If an `OidRef` or `null`, throw.
// Otherwise return the `child` passed in (assuming its a lieral or something else unclonable).
export function cloneOrDie(child, operation) {
// TODO: don't allow "" ???
  if (child == null) die(oak, operation, child, "Child must not be null");
  if (child instanceof OidRef) die(oak, operation, child, "Child must not be an OidRef");
  if (child instanceof JSXElement) return child.clone();
//TODO: use generic `clone()` ???
  return child;
}






// Export all in one go
export default Object.assign({}, exports);

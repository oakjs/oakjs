"use strict";
//////////////////////////////
//
//	SemanticUI React framework root singleton.
//	All other widgets/etc get hung off of this.
//
//////////////////////////////

import React from "react";


// Create with an IIFE for reflection in debugger.
const SUI = new (function SUI() {})();

export function flatten(...args) {
  return _flattenOne(args);
}
function _flattenOne(array) {
  return array.reduce((all, next) => all.concat(Array.isArray(next) ? _flattenOne(next) : next), []);
}

//DEPRECATED
// Same as React.createElement, but we flatten any arrays in elements first
export function createFlattenedElement(constructor, properties, ...elements) {
  const flattened = flatten(elements);
  return React.createElement(constructor, properties, ...flattened);
}


//DEPRECATED
// Given a list of elements which may be strings, a single Element or an array of elements
//  merge into one list.
export function addElements(...elements) {
  return elements.reduce((all, next) => all.concat(next), []);
}

//DEPRECATED
// Given two lists of elements to add together, add the first one on the left or the right
//  according to `addOn`.
export function addElementsOn(addOn="left", elementsToAdd, ...elements) {
  if (addOn === "left") return addElements(elementsToAdd, ...elements);
  return addElements(...elements, elementsToAdd);
}


//DEPRECATED -- MOVE TO OAK?
// Generate an id string for a component wich is guaranteed to be unique within the page.
const GENERATED_ID_MAP = {};
export function generateId(prefix="ID") {
  if (!GENERATED_ID_MAP[prefix]) GENERATED_ID_MAP[prefix] = 0;
  return prefix + (++GENERATED_ID_MAP[prefix]);
}


//TODO: RENAME
// Return all properties in `props` which are not defined in `propTypes`.
// This is far more efficient than doing a ...spread operator to pull those properties out.
export function unknownProperties(props, propTypes) {
  const unknown = {};
  for (let key in props) {
    if (propTypes[key] === undefined) unknown[key] = props[key];
  }
  return unknown;
}

//TODO: RENAME
// Return a map of values in `newProps` which are not the same as values in `oldProps`.
// If a property is in `oldProps` but is not in `newProps`, will return value `undefined`.
// NOTE: does not exhaustively make sure we've gone through everything in `oldProps`.
// Returns `undefined` if there's nothing in `newProps` which is not also in `oldProps`.
export function diffObjects(newProps, oldProps, checkOldProps=false) {
  if (!newProps) return undefined;
  if (!oldProps) return newProps;

  const deltas = {}
  let deltaFound = false;

  // grab values in newProps which are not in oldProps
  for (let property in newProps) {
    const newValue = newProps[property];
    if (oldProps[property] !== newValue) {
      deltas[property] = newValue;
      deltaFound = true;
    }
  }

  if (checkOldProps) {
    // mark anything in `oldProps` that's not in `newProps` as `undefined`.
    for (let property in oldProps) {
      if (property in deltas || property in newProps) continue;
      deltas[property] = undefined;
      deltaFound = true;
    }
  }

  return (deltaFound ? deltas : undefined);
}

//	Return `true` if the `thing` passed in appears to be a rendered React element.
//  Must also match the `type`, if specified.
export function isElement(thing, type) {
  if (!thing) return false;
  if (!thing.$$typeof) return false;
  if (type !== undefined) return thing.type === type;
  return true;
}

// Return `true` if the thing is an element and has the specified `className`.
export function hasClass(thing, className) {
  if (!isElement(thing)) return false;
  return thing.props.className && thing.props.className.includes(className);
}


// Assign all exports to the SUI object
Object.assign(SUI, exports);

// Make default export.
export default SUI;


// DEBUG: make SUI global for debugging
if (typeof window !== undefined) window.SUI = SUI;

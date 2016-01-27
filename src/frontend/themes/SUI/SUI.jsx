"use strict";
//////////////////////////////
//
//	SemanticUI React framework root singleton.
//	All other widgets/etc get hung off of this.
//
//////////////////////////////


// Create with an IIFE for reflection in debugger.
const SUI = new (function SUI() {})();


// Given a list of elements which may be strings, a single Element or an array of elements
//  merge into one list.
function addElements(...elements) {
  return elements.reduce((all, next) => all.concat(next), []);
}

// Given two lists of elements to add together, add the first one on the left or the right
//  according to `addOn`.
function addElementsOn(addOn="left", elementsToAdd, ...elements) {
  if (addOn === "left") return addElements(elementsToAdd, ...elements);
  return addElements(...elements, elementsToAdd);
}

  // Generate an id string for a component wich is guaranteed to be unique within the page.
const GENERATED_ID_MAP = {};
function generateId(prefix="ID") {
  if (!GENERATED_ID_MAP[prefix]) GENERATED_ID_MAP[prefix] = 0;
  return prefix + (++GENERATED_ID_MAP[prefix]);
}

// Return all properties in `props` which are not defined in `propTypes`.
// This is far more efficient than doing a ...spread operator to pull those properties out.
function unknownProperties(props, propTypes) {
  const unknown = {};
  for (let key in props) {
    if (propTypes[key] === undefined) unknown[key] = props[key];
  }
  return unknown;
}


// Static methods.
Object.assign(SUI, {

	//	Return `true` if the `thing` passed in appears to be a rendered React element.
	//  Must also match the `type`, if specified.
	isElement(thing, type) {
		if (!thing) return false;
		if (!thing.$$typeof) return false;
		if (type !== undefined) return thing.type === type;
		return true;
	},

  addElements: addElements,
  addElementsOn: addElementsOn,
  generateId: generateId,
  unknownProperties: unknownProperties,


});

// Make default export.
export default SUI;


// DEBUG: make SUI global for debugging
if (typeof window !== undefined) window.SUI = SUI;

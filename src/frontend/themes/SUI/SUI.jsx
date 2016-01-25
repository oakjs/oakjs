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


});

// Make default export.
export default SUI;


// DEBUG: make SUI global for debugging
if (typeof window !== undefined) window.SUI = SUI;

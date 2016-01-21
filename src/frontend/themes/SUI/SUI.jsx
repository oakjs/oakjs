"use strict";
//////////////////////////////
//
//	SemanticUI React framework root singleton.
//	All other widgets/etc get hung off of this.
//
//////////////////////////////


// Create with an IIFE for reflection in debugger.
const SUI = new (function SUI() {})();

// Static methods.
Object.assign(SUI, {

	//	Return `true` if the `thing` passed in appears to be a rendered React element.
	//  Must also match the `type`, if specified.
	isElement(thing, type) {
		if (!thing) return false;
		if (!thing.$$typeof) return false;
		if (type !== undefined) return thing.type === type;
		return true;
	}


});

// Make default export.
export default SUI;


// DEBUG: make SUI global for debugging
if (typeof window !== undefined) window.SUI = SUI;

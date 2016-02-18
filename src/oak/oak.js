"use strict";
//////////////////////////////
//
//	`oakjs` framework root singleton.
//	All other widgets/etc get hung off of this.
//
//////////////////////////////

// Create with an IIFE for reflection in debugger.
const oak = new (function oak() {})();

export default oak;

// GLOBAL EXPORT OF OAK SINGLETON
if (typeof window !== "undefined") window.oak = oak;
if (typeof global !== "undefined") global.oak = oak;




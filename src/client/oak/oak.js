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

// Global export for debugging / reflection
import global from "oak-roots/util/global";
global.oak = oak;

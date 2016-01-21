"use strict";
//////////////////////////////
//
//	Pull all SemanticUI widget extras into one file for easy include.
//
//////////////////////////////

// Export the root of the SUI namespace
import SUI from "../SUI";

// Export all individual components here.
// NOTE: keep this list in alphabetical order!
export { default as CountryMap } from "./CountryMap";

// Attach all of the components to the SUI namespace
Object.keys(exports).forEach(key => SUI[key] = exports[key]);

// Export SUI as the default.
export default SUI;

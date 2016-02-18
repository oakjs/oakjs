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
export CountryMap from "./CountryMap";

// Attach all of the components to the SUI namespace
Object.assign(SUI, exports);

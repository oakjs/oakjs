//////////////////////////////
//  Adapt all built-in Oak components to work in dynamic Pages.
//////////////////////////////

import oak from "oak/oak";

// Register all components under "Oak" package.
import components from "./Oak/";
oak.registerComponents("Oak", components);

//////////////////////////////
//  Register built-in oakjs components as `<Oak.ComponentName/>`.
//
//  Note: the components actually live under `src/oak/components`.
//////////////////////////////

import oak from "oak/oak";

// Register all components under "Oak" package.
import components from "./Oak/";
oak.registerComponents("Oak", components);

//////////////////////////////
//  Register built-in oakjs components as `<Oak.ComponentName/>`.
//
//  Note: the components actually live under `src/oak/components`.
//////////////////////////////

import { registerComponents } from "oak/registerComponents";
import oak from "oak/oak";
import components from "./Oak/";
export default registerComponents(oak, "Oak", components);

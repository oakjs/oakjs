//////////////////////////////
//  Register built-in oakjs components as `<Oak.ComponentName/>`.
//
//  Note: the components actually live under `src/oak/components`.
//////////////////////////////

import { registerComponentLoaders } from "oak/registerComponents";
import oak from "oak/oak";
import components from "./Oak.all";
export default registerComponentLoaders(oak, "Oak", components);


// Explicity load some Oak components we know we'll need in the UI.
// This minimizes startup churn.
import "./Oak/ActionItem";
import "./Oak/AppMenu";
import "./Oak/AppMenubar";
import "./Oak/ComponentMenu";
import "./Oak/ComponentTree";
import "./Oak/EditorToolbar";
import "./Oak/FixedPanel";
import "./Oak/Panel";
import "./Oak/SelectionOverlay";
import "./Oak/Spacer";
import "./Oak/SplitPanel";

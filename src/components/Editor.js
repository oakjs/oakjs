//////////////////////////////
//  Adapt Editor components to work with oak editor
//////////////////////////////

import oak from "oak/oak";

// Register all components under "Editor" package.
import components from "./Editor/";
oak.registerComponents("Editor", components);

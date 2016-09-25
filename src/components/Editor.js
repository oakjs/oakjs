//////////////////////////////
//  Adapt Editor components to work with oak editor
//////////////////////////////

// Register all components under "Editor" package.
import { registerComponents } from "oak/registerComponents";
import oak from "oak/oak";
import components from "./Editor/";
export default registerComponents(oak, "Editor", components);

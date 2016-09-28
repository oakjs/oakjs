//////////////////////////////
//  Adapt Editor components to work with oak editor
//////////////////////////////

// Register all components under "Editor" package.
import { registerComponentLoaders } from "oak/registerComponents";
import oak from "oak/oak";
import components from "./Editor.all";
export default registerComponentLoaders(oak, "Editor", components);

"use strict";
//////////////////////////////
//
//	Pull all SemanticUI widgets into one file for easy include.
//
//  You can simply import `SUI` and use all of the components with the `SUI.` prefix:
//
//    import SUI from "./SUI"
//    ...
//    return <SUI.Menu.../><SUI.MenuHeader.../><SUI.MenuItem.../></SUI.Menu>
//
//  Or import the components you want individually and use them without prefixing:
//
//    import { Menu, MenuHeader, MenuItem } from "./SUI"
//    ...
//    return <Menu.../><MenuHeader.../><MenuItem.../></Menu>
//
//////////////////////////////

// Import Semantic-UI CSS and JS
console.warn("TODO: figure out how to include semanticUI in themes/SUI/index.js");
//import "semantic-ui-css/semantic.css";
//import "semantic-ui-css/semantic.js";

// Export the root of the SUI namespace
import SUI from "./SUI";

// Export all individual components here.
// NOTE: keep this list in alphabetical order!
export { default as SUIComponent } from "./SUIComponent";
export { default as Divider } from "./Divider";
export { default as Dropdown } from "./Dropdown";
export { default as Grid } from "./Grid";
export { default as Icon } from "./Icon";
export { default as Menu } from "./Menu";
export { default as MenuHeader } from "./MenuHeader";
export { default as MenuItem } from "./MenuItem";
export { default as Stub } from "./Stub";

// Attach all of the components to the SUI namespace
Object.keys(exports).forEach(key => SUI[key] = exports[key]);

// Export SUI as the default.
export default SUI;

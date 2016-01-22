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
export SUIComponent from "./SUIComponent";
export Button from "./Button";
export ButtonGroup from "./ButtonGroup";
export Conditional from "./Conditional";
export Container from "./Container";
export Divider from "./Divider";
export Dropdown from "./Dropdown";
export Flag from "./Flag";
export Grid from "./Grid";
export Header from "./Header";
export Icon from "./Icon";
export Menu from "./Menu";
export MenuHeader from "./MenuHeader";
export MenuItem from "./MenuItem";
export Message from "./Message";
export Popup from "./Popup";
export Pusher from "./Pusher";
export Rail from "./Rail";
export Sidebar from "./Sidebar";
export Segment from "./Segment";
export Stub from "./Stub";
export SubHeader from "./SubHeader";

// Attach all of the components to the SUI namespace
Object.keys(exports).forEach(key => SUI[key] = exports[key]);

// Export SUI as the default.
export default SUI;

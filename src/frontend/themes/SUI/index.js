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

// Export all individual components here.
// NOTE: keep this list in alphabetical order!
export SUIComponent from "./SUIComponent";
export Button from "./Button";
export ButtonGroup from "./ButtonGroup";
export Column from "./Column";
export Conditional from "./Conditional";
export Container from "./Container";
export Divider from "./Divider";
export Dropdown from "./Dropdown";
export Flag from "./Flag";
export Grid from "./Grid";
export Header from "./Header";
export Icon from "./Icon";
export Image from "./Image";
export Images from "./Images";
export Input from "./Input";
export Label from "./Label";
export Labels from "./Labels";
export List from "./List";
export ListItem from "./ListItem";
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

// get all of the components
const components = Object.keys(exports);

// Export the root of the SUI namespace
export SUI from "./SUI";

// Attach all of the components to the SUI namespace
components.forEach(key => exports.SUI[key] = exports[key]);

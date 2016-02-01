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
export Accordion from "./Accordion";
export Ad from "./Ad";
export Button from "./Button";
export Buttons from "./Buttons";
export Breadcrumb from "./Breadcrumb";
export Card from "./Card";
export Cards from "./Cards";
export Column from "./Column";
export Comment from "./Comment";
export Comments from "./Comments";
export Content from "./Content";
export Conditional from "./Conditional";
export Container from "./Container";
export Description from "./Description";
export Dimmer from "./Dimmer";
export Divider from "./Divider";
export Dropdown from "./Dropdown";
export ElementBuffer from "./ElementBuffer";
export Embed from "./Embed";
export Feed from "./Feed";
export FeedEvent from "./FeedEvent";
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
export Loader from "./Loader";
export Menu from "./Menu";
export MenuHeader from "./MenuHeader";
export MenuItem from "./MenuItem";
export Message from "./Message";
export Meta from "./Meta";
export Popup from "./Popup";
export Pusher from "./Pusher";
export Rail from "./Rail";
export Row from "./Row";
export Reveal from "./Reveal";
export Sidebar from "./Sidebar";
export Segment from "./Segment";
export Segments from "./Segments";
export Statistic from "./Statistic";
export Statistics from "./Statistics";
export Step from "./Step";
export Steps from "./Steps";
export Stub from "./Stub";
export Subheader from "./Subheader";
export Submenu from "./Submenu";
export Table from "./Table";
export Title from "./Title";

// get all of the components
const components = Object.keys(exports);

// Export the root of the SUI namespace
export SUI from "./SUI";

// Attach all of the components to the SUI namespace
components.forEach(key => exports.SUI[key] = exports[key]);

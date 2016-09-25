//////////////////////////////
//  Load Semantic UI components and adapt to work with drag and drop in oak.
//////////////////////////////

import oak from "oak/oak";

// Import all Semantic UI components as dynamic loaders
import components from "./SUI/index";

// Register component loaders.
import { registerComponentLoaders } from "oak/registerComponents";
registerComponentLoaders(oak, "SUI", components)

// Explicity load some SUI components we know we'll need in the UI.
// This minimizes startup churn.
import "./SUI/Menu";
import "./SUI/MenuItem";
import "./SUI/Submenu";
import "./SUI/Button";
import "./SUI/Buttons";
import "./SUI/Popup";

// Set up drag and drop preferences for SUI components.
//
// // Oak editor prefs
// import { editify } from "oak/EditorProps";
//
// // Components which are only draggable
// editify({ draggable: true, droppable: false },
//   "SUI.Ad", "SUI.Button", "SUI.Breadcrumb", "SUI.Card", "SUI.Checkbox",
//   "SUI.Comment", "SUI.Conditional", "SUI.CountryMap", "SUI.FeedEvent",
//   "SUI.Field", "SUI.Flag", "SUI.Icon", "SUI.Image", "SUI.Input",
//   "SUI.Item", "SUI.Label", "SUI.ListItem", "SUI.Loader",
//   "SUI.MenuHeader", "SUI.MenuItem", "SUI.Meta", "SUI.Nag",
//   "SUI.RadioButton", "SUI.Side", "SUI.Statistic", "SUI.Step",
//   "SUI.Tabbar", "SUI.Toggle",
// );
//
//
// // Components which can accept anything dragged on them
// editify({ draggable:true, droppable: true },
//   "SUI.Accordion", "SUI.Column", "SUI.Content", "SUI.Container",
//   "SUI.Description", "SUI.Dimmer", "SUI.Divider", "SUI.Dropdown",
//   "SUI.Embed", "SUI.Form", "SUI.Grid", "SUI.Header",
//   "SUI.Menu", "SUI.Message", "SUI.Modal",
//   "SUI.Popup", "SUI.Pusher", "SUI.Progress",
//   "SUI.Rail", "SUI.Rating", "SUI.Row", "SUI.Reveal",
//   "SUI.Sidebar", "SUI.Search", "SUI.Segment", "SUI.Sticky", "SUI.Stub",
//   "SUI.Subheader", "SUI.Submenu",
//   "SUI.Tab", "SUI.Table", "SUI.Title",
// );
//
// // Components which can accept only certain things dragged on them
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Button" }, "SUI.Buttons");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Card" }, "SUI.Cards");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Comment" }, "SUI.Comments");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.FeedEvent" }, "SUI.Feed");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Field" }, "SUI.Fields");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Images" }, "SUI.Images");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Item" }, "SUI.Items");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Label" }, "SUI.Labels");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.ListItem" }, "SUI.List");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.RadioButton" }, "SUI.RadioGroup");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Segment" }, "SUI.Segments");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Side" }, "SUI.Shape");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Statistic" }, "SUI.Statistics");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Step" }, "SUI.Steps");
// editify({ draggable:true, droppable: true, dropTypes: "SUI.Tab,SUI.Tabbar" }, "SUI.Tabs");
//

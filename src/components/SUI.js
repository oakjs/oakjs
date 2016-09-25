//////////////////////////////
//  Load Semantic UI components and adapt to work with drag and drop in oak.
//////////////////////////////

import { registerComponentLoaders } from "oak/registerComponents";
import oak from "oak/oak";

// Import all Semantic UI components as dynamic loaders
import components from "./SUI.all";

// Register component loaders.
registerComponentLoaders(oak, "SUI", components)

// Explicity load some SUI components we know we'll need in the UI.
// This minimizes startup churn.
import "./SUI/Button";
import "./SUI/Buttons";
import "./SUI/Container";
import "./SUI/Menu";
import "./SUI/MenuItem";
import "./SUI/Popup";
import "./SUI/Segment";
import "./SUI/Submenu";

// Set up drag and drop preferences for SUI components.

// Oak editor prefs
import DragProps from "oak/DragProps";

// Components which are only draggable
DragProps.register("SUI", { draggable: true, droppable: false },
  "Ad", "Button", "Breadcrumb", "Card", "Checkbox",
  "Comment", "Conditional", "CountryMap", "FeedEvent",
  "Field", "Flag", "Icon", "Image", "Input",
  "Item", "Label", "ListItem", "Loader",
  "MenuHeader", "MenuItem", "Meta", "Nag",
  "RadioButton", "Side", "Statistic", "Step",
  "Tabbar", "Toggle",
);


// Components which can accept anything dragged on them
DragProps.register("SUI", { draggable:true, droppable: true },
  "Accordion", "Column", "Content", "Container",
  "Description", "Dimmer", "Divider", "Dropdown",
  "Embed", "Form", "Grid", "Header",
  "Menu", "Message", "Modal",
  "Popup", "Pusher", "Progress",
  "Rail", "Rating", "Row", "Reveal",
  "Sidebar", "Search", "Segment", "Sticky", "Stub",
  "Subheader", "Submenu",
  "Tab", "Table", "Title",
);

// Components which can accept only certain things dragged on them
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Button" }, "Buttons");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Card" }, "Cards");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Comment" }, "Comments");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.FeedEvent" }, "Feed");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Field" }, "Fields");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Images" }, "Images");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Item" }, "Items");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Label" }, "Labels");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.ListItem" }, "List");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.RadioButton" }, "RadioGroup");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Segment" }, "Segments");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Side" }, "Shape");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Statistic" }, "Statistics");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Step" }, "Steps");
DragProps.register("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Tab,SUI.Tabbar" }, "Tabs");


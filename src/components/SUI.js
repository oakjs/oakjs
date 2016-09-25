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
import { editify } from "oak/EditorProps";

// Components which are only draggable
editify("SUI", { draggable: true, droppable: false },
  "Ad", "Button", "Breadcrumb", "Card", "Checkbox",
  "Comment", "Conditional", "CountryMap", "FeedEvent",
  "Field", "Flag", "Icon", "Image", "Input",
  "Item", "Label", "ListItem", "Loader",
  "MenuHeader", "MenuItem", "Meta", "Nag",
  "RadioButton", "Side", "Statistic", "Step",
  "Tabbar", "Toggle",
);


// Components which can accept anything dragged on them
editify("SUI", { draggable:true, droppable: true },
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
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Button" }, "Buttons");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Card" }, "Cards");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Comment" }, "Comments");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.FeedEvent" }, "Feed");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Field" }, "Fields");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Images" }, "Images");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Item" }, "Items");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Label" }, "Labels");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.ListItem" }, "List");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.RadioButton" }, "RadioGroup");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Segment" }, "Segments");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Side" }, "Shape");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Statistic" }, "Statistics");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Step" }, "Steps");
editify("SUI", { draggable:true, droppable: true, dropTypes: "SUI.Tab,SUI.Tabbar" }, "Tabs");


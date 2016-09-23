//////////////////////////////
//  Adapt Editor components to work with oak editor
//////////////////////////////

import oak from "oak/oak";

import components from "./SUI/components";

// Register all components under "SUI" package, eg:  `<SUI.Button/>`
oak.registerComponents("SUI", components);

// Oak editor prefs
import { editifyMap } from "oak/EditorProps";

// Components which are only draggable
editifyMap(components, { draggable: true, droppable: false },
  "Ad", "Button", "Breadcrumb", "Card", "Checkbox", "Comment", "Conditional", "CountryMap",
  "FeedEvent", "Field", "Flag", "Icon", "Image", "Input", "Item", "Label", "ListItem", "Loader",
  "MenuHeader", "MenuItem", "Meta", "Nag", "RadioButton", "Side", "Statistic", "Step",
  "Tabbar", "Toggle",
);


// Components which can accept anything dragged on them
editifyMap(components, { draggable:true, droppable: true },
  "Accordion", "Column", "Content", "Container",
  "Description", "Dimmer", "Divider", "Dropdown",
  "Embed", "Form", "Grid", "Header",
  "Menu", "Message", "Modal",
  "Popup", "Pusher", "Progress",
  "Rail", "Rating", "Row", "Reveal",
  "Sidebar", "Search", "Segment", "Sticky", "Stub", "Subheader", "Submenu",
  "Tab", "Table", "Title",
);

// Components which can accept only certain things dragged on them
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Button" }, "Buttons");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Card" }, "Cards");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Comment" }, "Comments");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "FeedEvent" }, "Feed");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Field" }, "Fields");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Images" }, "Images");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Item" }, "Items");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Label" }, "Labels");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "ListItem" }, "List");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "RadioButton" }, "RadioGroup");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Segment" }, "Segments");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Side" }, "Shape");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Statistic" }, "Statistics");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Step" }, "Steps");
editifyMap(components, { draggable:true, droppable: true, dropTypes: "Tab,Tabbar" }, "Tabs");


//////////////////////////////
//  Adapt SUI components to work with oak editor
//////////////////////////////

import components from "themes/SUI/components";
export default components;

// Components which are only draggable
oakify({ draggable: true },
  "Ad", "Button", "Breadcrumb", "Card", "Checkbox", "Comment", "Conditional", "CountryMap",
  "FeedEvent", "Field", "Flag", "Icon", "Image", "Input", "Item", "Label", "ListItem", "Loader",
  "MenuHeader", "MenuItem", "Meta", "Nag", "RadioButton", "Side", "Statistic", "Step",
  "Tabbar", "Toggle",
);


// Components which can accept anything dragged on them
oakify({ draggable:true, droppable: true },
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
oakify({ draggable:true, droppable: true, dropTypes:["Button"] }, "Buttons");
oakify({ draggable:true, droppable: true, dropTypes:["Card"] }, "Cards");
oakify({ draggable:true, droppable: true, dropTypes:["Comment"] }, "Comments");
oakify({ draggable:true, droppable: true, dropTypes:["FeedEvent"] }, "Feed");
oakify({ draggable:true, droppable: true, dropTypes:["Field"] }, "Fields");
oakify({ draggable:true, droppable: true, dropTypes:["Images"] }, "Images");
oakify({ draggable:true, droppable: true, dropTypes:["Item"] }, "Items");
oakify({ draggable:true, droppable: true, dropTypes:["Label"] }, "Labels");
oakify({ draggable:true, droppable: true, dropTypes:["ListItem"] }, "List");
oakify({ draggable:true, droppable: true, dropTypes:["RadioButton"] }, "RadioGroup");
oakify({ draggable:true, droppable: true, dropTypes:["Segment"] }, "Segments");
oakify({ draggable:true, droppable: true, dropTypes:["Side"] }, "Shape");
oakify({ draggable:true, droppable: true, dropTypes:["Statistic"] }, "Statistics");
oakify({ draggable:true, droppable: true, dropTypes:["Step"] }, "Steps");
oakify({ draggable:true, droppable: true, dropTypes:["Tab", "Tabbar"] }, "Tabs");


//////////////////////////////
//  Utility
//////////////////////////////
function oakify(props, ...keys) {
  keys.forEach(key => {
    const Component = components[key];
    if (!Component.oak) Component.oak = {};
    Object.assign(Component.oak, props);
  })
}

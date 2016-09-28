//////////////////////////////
//  Oak Editor Drag and Drop setup for HTML elements.
//  Dictates which components can be dropped where, etc.
//
//  TODO: SVG elements???
//  TODO: See https://github.com/facebook/react/blob/master/src/renderers/dom/client/validateDOMNesting.js
//
//////////////////////////////

import DragProps from "oak-roots/DragProps";

// SEE:  https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories
DragProps.register("", { droppable: true }, "a");
DragProps.register("", { droppable: true }, "abbr");
DragProps.register("", { droppable: true }, "address");
DragProps.register("", {}, "area");
DragProps.register("", { droppable: true }, "article");
DragProps.register("", { droppable: true }, "aside");
DragProps.register("", { droppable: true, dropTypes: "source" }, "audio");
DragProps.register("", { droppable: true }, "b");
DragProps.register("", {}, "base");
DragProps.register("", { droppable: true }, "bdi");
DragProps.register("", { droppable: true }, "bdo");
DragProps.register("", { droppable: true }, "big");
DragProps.register("", { droppable: true }, "blockquote");
DragProps.register("", { draggable: false, droppable: true }, "body");
DragProps.register("", {}, "br");
DragProps.register("", {}, "button");
DragProps.register("", {}, "canvas");
DragProps.register("", { droppable: true }, "caption");
DragProps.register("", { droppable: true }, "cite");
DragProps.register("", { droppable: true }, "code");
DragProps.register("", {}, "col");
DragProps.register("", { droppable: true, dropTypes: "col" }, "colgroup");
DragProps.register("", { droppable: true }, "data");
DragProps.register("", { droppable: true }, "datalist");
DragProps.register("", {}, "dd");
DragProps.register("", { droppable: true }, "del");
DragProps.register("", { droppable: true }, "details");
DragProps.register("", { droppable: true }, "dfn");
DragProps.register("", { droppable: true }, "dialog");
DragProps.register("", { droppable: true }, "div");
DragProps.register("", { droppable: true, dropTypes: "dl,dt" }, "dl");
DragProps.register("", { droppable: true }, "dt");
DragProps.register("", { droppable: true }, "em");
DragProps.register("", {}, "embed");
DragProps.register("", { droppable: true }, "fieldset");
DragProps.register("", { droppable: true }, "figcaption");
DragProps.register("", { droppable: true }, "figure");
DragProps.register("", { droppable: true }, "footer");
DragProps.register("", { droppable: true }, "form");
DragProps.register("", { droppable: true }, "h1");
DragProps.register("", { droppable: true }, "h2");
DragProps.register("", { droppable: true }, "h3");
DragProps.register("", { droppable: true }, "h4");
DragProps.register("", { droppable: true }, "h5");
DragProps.register("", { droppable: true }, "h6");
DragProps.register("", { draggable: false, droppable: true }, "head");
DragProps.register("", { droppable: true }, "header");
DragProps.register("", { droppable: true }, "hgroup");
DragProps.register("", {}, "hr");
DragProps.register("", { draggable: false }, "html");
DragProps.register("", { droppable: true }, "i");
DragProps.register("", { droppable: true }, "iframe");
DragProps.register("", {}, "img");
DragProps.register("", {}, "input");
DragProps.register("", { droppable: true }, "ins");
DragProps.register("", { droppable: true }, "kbd");
DragProps.register("", { droppable: true }, "keygen");
DragProps.register("", { droppable: true }, "label");
DragProps.register("", { droppable: true }, "legend");
DragProps.register("", { droppable: true }, "li");
DragProps.register("", {}, "link");
DragProps.register("", { droppable: true }, "main");
DragProps.register("", { droppable: true }, "map");
DragProps.register("", { droppable: true }, "mark");
DragProps.register("", { droppable: true }, "menu");
DragProps.register("", {}, "menuitem");
DragProps.register("", {}, "meta");
DragProps.register("", { droppable: true }, "meter");
DragProps.register("", { droppable: true }, "nav");
DragProps.register("", { droppable: true }, "noscript");
DragProps.register("", { droppable: true }, "object");
DragProps.register("", { droppable: true, dropTypes: "li,ol,ul" }, "ol");
DragProps.register("", { droppable: true, dropTypes: "option" }, "optgroup");
DragProps.register("", {}, "option");
DragProps.register("", { droppable: true }, "output");
DragProps.register("", { droppable: true }, "p");
DragProps.register("", {}, "param");
DragProps.register("", { droppable: true, dropTypes: "source,img" }, "picture");
DragProps.register("", { droppable: true }, "pre");
DragProps.register("", { droppable: true }, "progress");
DragProps.register("", { droppable: true }, "q");
DragProps.register("", { droppable: true }, "rp");
DragProps.register("", { droppable: true }, "rt");
DragProps.register("", { droppable: true }, "ruby");
DragProps.register("", { droppable: true }, "s");
DragProps.register("", { droppable: true }, "samp");
DragProps.register("", {}, "script");
DragProps.register("", { droppable: true }, "section");
DragProps.register("", { droppable: true, dropTypes: "option,optgroup" }, "select");
DragProps.register("", { droppable: true }, "small");
DragProps.register("", {}, "source");
DragProps.register("", { droppable: true }, "span");
DragProps.register("", { droppable: true }, "strong");
DragProps.register("", {}, "style");
DragProps.register("", { droppable: true }, "sub");
DragProps.register("", { droppable: true }, "summary");
DragProps.register("", { droppable: true }, "sup");
DragProps.register("", { droppable: true, dropTypes: "caption,colgroup,thead,tfoot,tbody,tr" }, "table");
DragProps.register("", { droppable: true, dropTypes: "tr" }, "tbody");
DragProps.register("", { droppable: true }, "td");
DragProps.register("", {}, "textarea");
DragProps.register("", { droppable: true, dropTypes: "tr" }, "tfoot");
DragProps.register("", { droppable: true }, "th");
DragProps.register("", { droppable: true, dropTypes: "tr" }, "thead");
DragProps.register("", { droppable: true }, "time");
DragProps.register("", {}, "title");
DragProps.register("", { droppable: true, dropTypes: "td,th" }, "tr");
DragProps.register("", {}, "track");
DragProps.register("", { droppable: true }, "u");
DragProps.register("", { droppable: true, dropTypes: "li,ol,ul" }, "ul");
DragProps.register("", { droppable: true }, "var");
DragProps.register("", { droppable: true }, "video");
DragProps.register("", {}, "wbr");


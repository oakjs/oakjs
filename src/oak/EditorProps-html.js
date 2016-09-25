//////////////////////////////
//  Oak Editor Drag and Drop setup for HTML elements.
//  Dictates which components can be dropped where, etc.
//
//  TODO: SVG elements???
//  TODO: See https://github.com/facebook/react/blob/master/src/renderers/dom/client/validateDOMNesting.js
//
//////////////////////////////

import { editify } from "./EditorProps";

// SEE:  https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories
editify("", { droppable: true }, "a");
editify("", { droppable: true }, "abbr");
editify("", { droppable: true }, "address");
editify("", {}, "area");
editify("", { droppable: true }, "article");
editify("", { droppable: true }, "aside");
editify("", { droppable: true, dropTypes: "source" }, "audio");
editify("", { droppable: true }, "b");
editify("", {}, "base");
editify("", { droppable: true }, "bdi");
editify("", { droppable: true }, "bdo");
editify("", { droppable: true }, "big");
editify("", { droppable: true }, "blockquote");
editify("", { draggable: false, droppable: true }, "body");
editify("", {}, "br");
editify("", {}, "button");
editify("", {}, "canvas");
editify("", { droppable: true }, "caption");
editify("", { droppable: true }, "cite");
editify("", { droppable: true }, "code");
editify("", {}, "col");
editify("", { droppable: true, dropTypes: "col" }, "colgroup");
editify("", { droppable: true }, "data");
editify("", { droppable: true }, "datalist");
editify("", {}, "dd");
editify("", { droppable: true }, "del");
editify("", { droppable: true }, "details");
editify("", { droppable: true }, "dfn");
editify("", { droppable: true }, "dialog");
editify("", { droppable: true }, "div");
editify("", { droppable: true, dropTypes: "dl,dt" }, "dl");
editify("", { droppable: true }, "dt");
editify("", { droppable: true }, "em");
editify("", {}, "embed");
editify("", { droppable: true }, "fieldset");
editify("", { droppable: true }, "figcaption");
editify("", { droppable: true }, "figure");
editify("", { droppable: true }, "footer");
editify("", { droppable: true }, "form");
editify("", { droppable: true }, "h1");
editify("", { droppable: true }, "h2");
editify("", { droppable: true }, "h3");
editify("", { droppable: true }, "h4");
editify("", { droppable: true }, "h5");
editify("", { droppable: true }, "h6");
editify("", { draggable: false, droppable: true }, "head");
editify("", { droppable: true }, "header");
editify("", { droppable: true }, "hgroup");
editify("", {}, "hr");
editify("", { draggable: false }, "html");
editify("", { droppable: true }, "i");
editify("", { droppable: true }, "iframe");
editify("", {}, "img");
editify("", {}, "input");
editify("", { droppable: true }, "ins");
editify("", { droppable: true }, "kbd");
editify("", { droppable: true }, "keygen");
editify("", { droppable: true }, "label");
editify("", { droppable: true }, "legend");
editify("", { droppable: true }, "li");
editify("", {}, "link");
editify("", { droppable: true }, "main");
editify("", { droppable: true }, "map");
editify("", { droppable: true }, "mark");
editify("", { droppable: true }, "menu");
editify("", {}, "menuitem");
editify("", {}, "meta");
editify("", { droppable: true }, "meter");
editify("", { droppable: true }, "nav");
editify("", { droppable: true }, "noscript");
editify("", { droppable: true }, "object");
editify("", { droppable: true, dropTypes: "li,ol,ul" }, "ol");
editify("", { droppable: true, dropTypes: "option" }, "optgroup");
editify("", {}, "option");
editify("", { droppable: true }, "output");
editify("", { droppable: true }, "p");
editify("", {}, "param");
editify("", { droppable: true, dropTypes: "source,img" }, "picture");
editify("", { droppable: true }, "pre");
editify("", { droppable: true }, "progress");
editify("", { droppable: true }, "q");
editify("", { droppable: true }, "rp");
editify("", { droppable: true }, "rt");
editify("", { droppable: true }, "ruby");
editify("", { droppable: true }, "s");
editify("", { droppable: true }, "samp");
editify("", {}, "script");
editify("", { droppable: true }, "section");
editify("", { droppable: true, dropTypes: "option,optgroup" }, "select");
editify("", { droppable: true }, "small");
editify("", {}, "source");
editify("", { droppable: true }, "span");
editify("", { droppable: true }, "strong");
editify("", {}, "style");
editify("", { droppable: true }, "sub");
editify("", { droppable: true }, "summary");
editify("", { droppable: true }, "sup");
editify("", { droppable: true, dropTypes: "caption,colgroup,thead,tfoot,tbody,tr" }, "table");
editify("", { droppable: true, dropTypes: "tr" }, "tbody");
editify("", { droppable: true }, "td");
editify("", {}, "textarea");
editify("", { droppable: true, dropTypes: "tr" }, "tfoot");
editify("", { droppable: true }, "th");
editify("", { droppable: true, dropTypes: "tr" }, "thead");
editify("", { droppable: true }, "time");
editify("", {}, "title");
editify("", { droppable: true, dropTypes: "td,th" }, "tr");
editify("", {}, "track");
editify("", { droppable: true }, "u");
editify("", { droppable: true, dropTypes: "li,ol,ul" }, "ul");
editify("", { droppable: true }, "var");
editify("", { droppable: true }, "video");
editify("", {}, "wbr");


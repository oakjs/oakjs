//////////////////////////////
//  Editor defaults for HTML elements
//
//  TODO: SVG elements???
//  TODO: See https://github.com/facebook/react/blob/master/src/renderers/dom/client/validateDOMNesting.js
//
//////////////////////////////

// SEE:  https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories
export default {
  "a": { draggable: true, droppable: true },
  "abbr": { draggable: true, droppable: true },
  "address": { draggable: true, droppable: true },
  "area": { draggable: true, droppable: false },
  "article": { draggable: true, droppable: true },
  "aside": { draggable: true, droppable: true },
  "audio": { draggable: true, droppable: true, dropTypes: ["source"] },
  "b": { draggable: true, droppable: true },
  "base": { draggable: true, droppable: false },
  "bdi": { draggable: true, droppable: true },
  "bdo": { draggable: true, droppable: true },
  "big": { draggable: true, droppable: true },
  "blockquote": { draggable: true, droppable: true },
  "body": { draggable: false, droppable: true },
  "br": { draggable: true, droppable: false },
  "button": { draggable: true, droppable: false },
  "canvas": { draggable: true, droppable: false },
  "caption": { draggable: true, droppable: true },
  "cite": { draggable: true, droppable: true },
  "code": { draggable: true, droppable: true },
  "col": { draggable: true, droppable: false },
  "colgroup": { draggable: true, droppable: true, dropTypes: ["col"] },
  "data": { draggable: true, droppable: true },
  "datalist": { draggable: true, droppable: true },
  "dd": { draggable: true, droppable: false },
  "del": { draggable: true, droppable: true },
  "details": { draggable: true, droppable: true },
  "dfn": { draggable: true, droppable: true },
  "dialog": { draggable: true, droppable: true },
  "div": { draggable: true, droppable: true },
  "dl": { draggable: true, droppable: true, dropTypes: ["dl","dt"] },
  "dt": { draggable: true, droppable: true },
  "em": { draggable: true, droppable: true },
  "embed": { draggable: true, droppable: false },
  "fieldset": { draggable: true, droppable: true },
  "figcaption": { draggable: true, droppable: true },
  "figure": { draggable: true, droppable: true },
  "footer": { draggable: true, droppable: true },
  "form": { draggable: true, droppable: true },
  "h1": { draggable: true, droppable: true },
  "h2": { draggable: true, droppable: true },
  "h3": { draggable: true, droppable: true },
  "h4": { draggable: true, droppable: true },
  "h5": { draggable: true, droppable: true },
  "h6": { draggable: true, droppable: true },
  "head": { draggable: false, droppable: true },
  "header": { draggable: true, droppable: true },
  "hgroup": { draggable: true, droppable: true },
  "hr": { draggable: true, droppable: false },
  "html": { draggable: false, droppable: false },
  "i": { draggable: true, droppable: true },
  "iframe": { draggable: true, droppable: true },
  "img": { draggable: true, droppable: false },
  "input": { draggable: true, droppable: false },
  "ins": { draggable: true, droppable: true },
  "kbd": { draggable: true, droppable: true },
  "keygen": { draggable: true, droppable: true },
  "label": { draggable: true, droppable: true },
  "legend": { draggable: true, droppable: true },
  "li": { draggable: true, droppable: true },
  "link": { draggable: true, droppable: false },
  "main": { draggable: true, droppable: true },
  "map": { draggable: true, droppable: true },
  "mark": { draggable: true, droppable: true },
  "menu": { draggable: true, droppable: true },
  "menuitem": { draggable: true, droppable: false },
  "meta": { draggable: true, droppable: false },
  "meter": { draggable: true, droppable: true },
  "nav": { draggable: true, droppable: true },
  "noscript": { draggable: true, droppable: true },
  "object": { draggable: true, droppable: true },
  "ol": { draggable: true, droppable: true, dropTypes: ["li","ol","ul"] },
  "optgroup": { draggable: true, droppable: true, dropTypes: ["option"] },
  "option": { draggable: true, droppable: false },
  "output": { draggable: true, droppable: true },
  "p": { draggable: true, droppable: true },
  "param": { draggable: true, droppable: false },
  "picture": { draggable: true, droppable: true, dropTypes: ["source","img"] },
  "pre": { draggable: true, droppable: true },
  "progress": { draggable: true, droppable: true },
  "q": { draggable: true, droppable: true },
  "rp": { draggable: true, droppable: true },
  "rt": { draggable: true, droppable: true },
  "ruby": { draggable: true, droppable: true },
  "s": { draggable: true, droppable: true },
  "samp": { draggable: true, droppable: true },
  "script": { draggable: true, droppable: false },
  "section": { draggable: true, droppable: true },
  "select": { draggable: true, droppable: true, dropTypes: ["option","optgroup"] },
  "small": { draggable: true, droppable: true },
  "source": { draggable: true, droppable: false },
  "span": { draggable: true, droppable: true },
  "strong": { draggable: true, droppable: true },
  "style": { draggable: true, droppable: false },
  "sub": { draggable: true, droppable: true },
  "summary": { draggable: true, droppable: true },
  "sup": { draggable: true, droppable: true },
  "table": { draggable: true, droppable: true, dropTypes: ["caption","colgroup","thead","tfoot","tbody","tr"] },
  "tbody": { draggable: true, droppable: true, dropTypes: ["tr"] },
  "td": { draggable: true, droppable: true },
  "textarea": { draggable: true, droppable: false },
  "tfoot": { draggable: true, droppable: true, dropTypes: ["tr"] },
  "th": { draggable: true, droppable: true },
  "thead": { draggable: true, droppable: true, dropTypes: ["tr"] },
  "time": { draggable: true, droppable: true },
  "title": { draggable: true, droppable: false },
  "tr": { draggable: true, droppable: true, dropTypes: ["td","th"] },
  "track": { draggable: true, droppable: false },
  "u": { draggable: true, droppable: true },
  "ul": { draggable: true, droppable: true, dropTypes: ["li","ol","ul"] },
  "var": { draggable: true, droppable: true },
  "video": { draggable: true, droppable: true },
  "wbr": { draggable: true, droppable: false }
}

//////////////////////////////
//
//  Classes for manipulating / working directly with DOM elements.
//  Similar to stuff you'd do with jQuery,
//  but using HTML5 APIs and as fast as possible.
//
//////////////////////////////

import Rect from "../Rect";

// Return the viewport rect -- relative to the VIEWPORT, NOT including scrolling.
export function viewportRect(element) {
  if (!element) return new Rect();
  const rect = element.getBoundingClientRect();
  return new Rect(rect.left, rect.top, rect.width, rect.height);
}

// Return the OFFSET rect -- relative to the DOCUMENT, INCLUDING scrolling.
export function offsetRect(element) {
  if (!element) return new Rect();
  const clientRect = element.getBoundingClientRect();
  return new Rect(
    clientRect.left + window.scrollX,
    clientRect.top + window.scrollY,
    clientRect.width,
    clientRect.height
  );
}

// Return `true` if the specified `element` matches the `selector`.
var matchesMethod = "matches";
if (!Element.prototype.matches) {
  if (Element.prototype.msMatchesSelector) matchesMethod = "msMatchesSelector";
  if (Element.prototype.webkitMatchesSelector) matchesMethod = "webkitMatchesSelector";
}
export function matches(element, selector) {
  if (typeof element[matchesMethod] !== "function") return false;
  return element[matchesMethod](selector);
}


// Given a node or element, return element or closest parent which matches selector.
export function closestMatching(element, selector) {
  if (!element) return undefined;
  let ancestor = (element instanceof Element ? element : element.parentNode);
  while (ancestor.parentElement) {
    if (matches(ancestor, selector)) return ancestor;
    ancestor = ancestor.parentElement;
  }
  return undefined;
}


export default Object.assign({}, exports);

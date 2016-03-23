//////////////////////////////
//
//  App extensions for editing
//
//////////////////////////////

import app from "./app";

Object.assign(app, {

  getOidRects: function() {
    if (!this.projectComponent) return undefined;
    console.time("oidRects");
    //TODO: somehow we want to know the root element on the page so don't include toolbars...
    const oidElements = document.querySelectorAll("[data-oid]");
    const rects = [];
    let i = -1, element;
    while (element = oidElements[++i]) {
      rects[i] = roots.elements.offsetRect(element);
      rects[i].oid = element.getAttribute("data-oid");
    }
    console.timeEnd("oidRects");

    if (!this._renderCache) this._renderCache = {};
    this._renderCache.oidRects = rects;
    return rects;
  },

});

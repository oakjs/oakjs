//////////////////////////////
//
//  Stylesheet class for manipulating / showing CSS
//
//////////////////////////////
"use strict"

import { dieIfMissing } from "oak-roots/util/die";
import browser from "oak-roots/util/browser";

export default class Stylesheet {

  // Props:
  //  - `css`     css styles
  //  - `id`      unique id for the stylesheet within the page
  //              (we'll make one up if necessary)
  constructor(props) {
    Object.assign(this, props);
    this._installStyles();
  }

  destroy() {
    browser.removeStylesheet(this.id);
  }

  _installStyles() {
    if (!this.css) return this.destroy();
    this.id = browser.createStylesheet(this.css, this.id);
  }

  // Update the CSS for this stylesheet dynamically.
  update(css) {
    this.css = css;
    this._installStyles();
  }

}

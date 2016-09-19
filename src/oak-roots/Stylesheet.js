//////////////////////////////
//
//  Stylesheet class for manipulating / showing CSS.
//
//  After you create a `Stylesheet`, you can call `stylesheet.update(css)`
//  to change the CSS dynamically.  If you attempt to set it to the same CSS,
//  nothing will change.
//
//  Call `stylesheet.destroy()` to remove the stylesheet from the browser.
//
//  If you want to re-use a stylesheet, rather than `new`-ing them yourself,
//  use `Stylesheet.get(<identifier>)`, which will return the same stylesheet
//  repeatedly as many times as it's called.
//
//////////////////////////////
"use strict"

import { dieIfMissing } from "oak-roots/util/die";
import browser from "oak-roots/util/browser";
import ids from "oak-roots/util/ids";

export default class Stylesheet {

  // Props:
  //  - `css`     css styles
  //  - `id`      unique id for the stylesheet within the page
  //              (we'll make one up if necessary)
  constructor(props) {
    Object.assign(this, props);

    // Make sure we have an id
    if (!this.id) {
      this.id = "STYLE-"+ids.generateRandomId();
    }
    // normalize the id
    else {
      this.id = ids.normalizeIdentifier(this.id);
    }

    // install the stylesheet if we have CSS
    if (this.css) this._installStyles();
  }

  destroy() {
    browser.removeStylesheet(this.id);
  }

  _installStyles() {
    if (!this.css) return this.destroy();
    browser.createStylesheet(this.css, this.id);
  }

  // Update the CSS for this stylesheet dynamically.
  // No-op if the `css` doesn't actually change.
  update(css) {
    if (css === this.css) return;
    this.css = css;
    this._installStyles();
  }

  // Registry of known / managed stylesheets.
  static REGISTRY = {};

  // Return a pointer to a named stylesheet, creating one if necessary.
  // Returns the same Stylesheet object given the same `id`.
  static get(id) {
    return Stylesheet.REGISTRY[id]
      || ( Stylesheet.REGISTRY[id] = new Stylesheet({ id }) );
  }

}

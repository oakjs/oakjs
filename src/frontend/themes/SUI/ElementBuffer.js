import React from "react";
import classNames from "classnames";

import { flatten } from "./SUI";

class ElementBuffer {

  constructor(constructor="div", props={}) {
    this.constructor = constructor;
    this.props = props;
    this.elements = [];
  }

  get length() {
    return this.elements.length;
  }

  // Prepend one or more elements BEFORE the other elements.
  prepend(...elements) {
    this.elements = flatten(elements).concat(this.elements);
    return this;
  }

  // Append one or more elements to the end of this list.
  append(...elements) {
    this.elements = this.elements.concat(flatten(elements));
  }

  // Add one or more elements on either the left or the right
  addOn(side, ...elements) {
    if (side === "left")  this.prepend(elements);
    else                  this.append(elements);
  }

  // If you want to add an actual list, use this one!
  // NOTE: if you usse this, you have to make sure your elements have `key`s.
  appendList(elements) {
    this.elements.push(elements)
  }

  get props() { return this._props }
  set props(props) {
    this._props = {...props};
    // if className is an array, flatten it with `classNames`
    if (this._props.className) this.className = this._props.className;
  }

  // Set className to a list of things
  // Used `classNames` semantics.
  get className() { return this._props.className || ""; }
  set className(...names) {
    this._props.className = classNames(...names);
  }

  // Render!
  render(constructor=this.constructor, props) {
    if (props) this.props = props;
    return React.createElement(constructor, this._props, ...this.elements);
  }

  // Wrap the current set of elements in a container.
  // You can then keep using append() and prepend() as before.
  wrap(constructor, props) {
    this.elements = [ this.render(constructor, props) ];
    this._props = {};
  }
}

export default ElementBuffer;

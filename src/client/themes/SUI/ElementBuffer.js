import React from "react";
import classNames from "oak-roots/util/react";

window.classNames = classNames;

import { flatten } from "./SUI";
import Icon from "./Icon";

class ElementBuffer {

  constructor({ type = "div", props = {}, elements = [] } = {}) {
    this.type = type;
    this.props = props;
    this.elements = elements;
  }

  //////////////////////////////
  // adding elements
  //////////////////////////////

  get isEmpty() { return this.elements.length === 0 }
  get length() { return this.elements.length; }

  // Prepend one or more elements BEFORE the other elements.
  prepend(...elements) {
    this.elements = flatten(elements).concat(this.elements);
    return this;
  }

  // Append one or more elements to the end of this list.
  append(...elements) {
    this.elements = this.elements.concat(flatten(elements));
  }

  // Add one or more elements on either the `left` or the `right`
  addOn(side, ...elements) {
    if (side === "left" || side === "top") {
      this.prepend(elements);
    }
    else {
      this.append(elements);
    }
  }

  // If you want to add an actual list, use this one!
  // NOTE: if you usse this, you have to make sure your elements have `key`s.
  // TODO: automatically add keys ???  can we do that???
  appendList(elements) {
    this.elements.push(elements)
  }

  //////////////////////////////
  // creating/adding nested elements
  //////////////////////////////

  // Wrap content in an enclosing div.
  createWrapped(type, props, content) {
    if (typeof props === "string") props = { className: props };
    let wrapper;
    if (Array.isArray(content)) return React.createElement(type, props, ...content);
    return React.createElement(type, props, content);
  }

  // Wrap content and append to the end of the list
  // You can pass a string, an element or an array it'll just work.
  // If you pass a string for `props`, we'll assume you just want that as a className
  prependWrapped(type, props, content) {
    const wrapped = this.createWrapped(type, props, content);
    this.prepend(wrapped);
  }

  // Wrap content and append to the end of the list
  // You can pass a string, an element or an array it'll just work.
  // If you pass a string for `props`, we'll assume you just want that as a className
  appendWrapped(type, props, content) {
    const wrapped = this.createWrapped(type, props, content);
    this.append(wrapped);
  }



  //////////////////////////////
  // props and class manipulation
  //////////////////////////////

  get props() { return this._props }
  set props(props) {
    this._props = this.normalizeProps(props);
  }

  normalizeProps(props) {
    const output = {};
    for (let key in props) {
      // skip any undefiend properties
      if (props[key] === undefined) continue;

      const value = props[key];
      // normalize className with `classNames`
      if (key === "className") output[key] = classNames(value);
      else output[key] = value;
    }
    return output;
  }

  // Set className to a list of things
  // Used `classNames` semantics.
  get className() { return this._props.className || ""; }
  set className(...names) {
    this._props.className = classNames(names);
  }

  // Add a className using `classNames` semantics.
  addClass(...classes) {
    this._props.className = classNames(this._props.className, classes);
  }

  // Set a style property.  Adds a `style` property if necessary.
  setStyle(property, value) {
    if (!this._props.style) this._props.style = {};
    this._props.style[property] = value;
  }


  //////////////////////////////
  // icon utilities
  //////////////////////////////

  createIcon(icon, appearance) {
    if (!icon) return undefined;
    if (typeof icon !== "string") return icon;
    return <Icon icon={icon} appearance={appearance}/>;
  }

  prependIcon(...iconArgs) {
    const element = this.createIcon(...iconArgs);
    if (element) this.prepend(element);
  }

  appendIcon(...iconArgs) {
    const element = this.createIcon(...iconArgs);
    if (element) this.append(element);
  }

  addIconOn(side, ...iconArgs) {
    const element = this.createIcon(...iconArgs);
    if (element) this.addOn(side, element);
  }

  //////////////////////////////
  // image utilities
  //////////////////////////////

  createImage(image, appearance) {
    if (!image) return undefined;
    if (typeof image !== "string") return image;
    return <img src={image} className={appearance}/>
  }

  prependImage(...imageArgs) {
    const element = this.createImage(...imageArgs);
    if (element) this.prepend(element);
  }

  appendImage(...imageArgs) {
    const element = this.createImage(...imageArgs);
    if (element) this.append(element);
  }

  addImageOn(side, ...imageArgs) {
    const element = this.createImage(...imageArgs);
    if (element) this.addOn(side, element);
  }



  //////////////////////////////
  // rendering and wrapping
  //////////////////////////////

  // Wrap the current set of elements in a container.
  // You can then keep using append() and prepend() as before.
  // NOTE: You can pass in a set of props for the wrapper,
  //       but this does not affect `this.props` in any way!
  wrap(type = this.type, props) {
    if (props) {
      if (typeof props === "string") props = { className: props };
      else props = this.normalizeProps(props);
    }
    this.elements = [ React.createElement(type, props, ...this.elements) ];
  }

  // Render!
  render(type =  this.type, props) {
    // If we got `props`, assign them to `props` so we get className normalization.
    if (props) this.props = props;
    return React.createElement(type, this._props, ...this.elements);
  }

}

export default ElementBuffer;

//////////////////////////////
//
//  ComponentLoader class
//
//  Loads a component from a bundle, vends a `Component`.
//
//////////////////////////////
"use strict"

import React from "react";

import Loadable from "oak-roots/Loadable";
import Mutable from "oak-roots/Mutable";
import Savable from "oak-roots/Savable";

import babel from "oak-roots/util/babel";
import browser from "oak-roots/util/browser";
import { autobind } from "oak-roots/util/decorators";
import { generateRandomId, normalizeIdentifier } from "oak-roots/util/ids";
import { dieIfMissing } from "oak-roots/util/object";

import api from "./api";
import JSXElement, { OidRef } from "./JSXElement";

import Stub from "./components/Stub";



export default class ComponentLoader extends Savable(Loadable(Mutable)) {

  //////////////////////////////
  //  Creation / destruction
  //////////////////////////////

  constructor(...args) {
    super(...args);
    dieIfMissing(this, ["controller", "SuperConstructor", "type", "path"]);
  }

  destroy() {
    if (this.styles) browser.removeStylesheet(this.stylesheetId);
  }

  get jsxElement() { return this.oids && this.oids[this.rootOid] }

  //////////////////////////////
  //  Loading
  //////////////////////////////
  loadData() {
    return api.loadComponentBundle(this.controller)
      .then(bundle => {
        if (bundle.jsxe) {
          try {
            const options = {
              oids: {},
              itemProps : {
                getElement: this.getElement
              }
            };
            // parse the jsxElement
            const jsxElement = JSXElement.parse(bundle.jsxe, options);
            // save the oid of the root element
            bundle.rootOid = jsxElement.oid;
            // save the oids so we can get the elements back.
            bundle.oids = options.oids;

            // don't save the jsxe
            delete bundle.jsxe;
          }
          catch (e) {
            console.group(`Error parsing JSXE for ${this.controller.type}`);
            console.error(e);
            console.groupEnd();
            throw e;
          }
        }
        return bundle;
      })
      .then(bundle => {
        this.mutate(bundle);
        return this
      });
  }


  //////////////////////////////
  //  Dealing with component elements
  //////////////////////////////

  @autobind
  getElement(oid) {
    return this.oids && this.oids[oid];
  }

  // Add an element in our map according to its `oid`.
  // Returns thing that was under that `oid` before, if any.
  add(element) {
    this._dieIfNoOids("add", arguments);
    if (!(element instanceof JSXElement)) this._die("add", element, "expected a JSXElement");

    const oid = element.oid;
    const oldElement = this.oids[oid];

    // make sure the element looks up to us for parenting!
    newElement.getElement = this.getElement;
    this.oids[oid] = newElement;

    return oldElement;
  }

  // Remove an element specified by `oid` or by reference.
  // Returns the element that was removed, if there was one.
  remove(oidOrElement) {
    this._dieIfNoOids("remove", arguments);

    const oid = (typeof oidOrElement === "string" ? oidOrElement : oidOrElement.oid);
    const oldElement = this.oids[oid];

    delete this.oids[oid];
    return oldElement;
  }


  // Set a single prop of an element.
  // Returns the original element BEFORE properties were set.
  // Throws if the element isn't found.
  setProp(oid, key, value) {
    const clone = this._getElementOrDie(oid, "setProp").clone();
    clone.props[key] = value;
    return this.add(clone);
  }

  // Set a single prop of an element.
  // Returns the original element BEFORE properties were set.
  // Throws if the element isn't found.
  setProps(oid, props) {
    const clone = this._getElementOrDie(oid, "setProp").clone();
    clone.props = Object.assign(clone.props || {}, props);
    return this.add(clone);
  }

  // Reset all props of an element.
  // Returns the original element BEFORE properties were set.
  // Throws if the element isn't found.
  resetProps(oid, props) {
    const clone = this._getElementOrDie(oid, "setProp").clone();
    clone.props = Object.assign({}, props);
    return this.add(clone);
  }


  // Set `child` of some parent at `position`.
  // Replaces whatever was at that position.
  // Returns original parent, unmodified.
  //
  // If you pass a `JSXElement`, we'll insert an `OidRef` instead
  //  and automatically add the element with `addElement()`.
  // If you pass a string or a literal or something else , we'll add it directly.
  //
  // Throws if `position` is outside the current range of the parent or is otherwise wonky.
  setChild(parentOid, child, position) {
    const parent = this._getElementOrDie(parentOid, "setChild", "parent not found");
    this._dieIfInvalidChildPosition(parent, position, "setChild");

    // if we were passed an element, add it to the table and add an `OidRef` to the parent.
    if (child instanceof JSXElement) {
      this.addElement(child);
      child = new OidRef(child.oid);
    }

    // create a new array and modify that
    const children = Array.from(parent._children);
    children[position] = child;
    return this.set(parent, { _children: children });
  }

  // Add a new child to some parent at `position`, possibly pushing other children out of the way.
  // Defaults to putting things at the end.
  // Pass `position = 0` to prepend.
  //
  // If you pass a `JSXElement`, we'll insert an `OidRef` instead
  //  and add the element with `addElement()`.
  // If you pass a string or a literal or something else , we'll add it directly.
  //
  // Throws if `position` is outside range of the parent or is otherwise wonky.
  addChild(parentOid, child, position) {
    const parent = this._getElementOrDie(parentOid, "addChild", "parent not found");

    // default _children array if we don't have one
    const children = parent._children || (parent._children = []);
    if (position === undefined) {
      position = children.length;
    } else {
      this._dieIfInvalidChildPosition(parent, position, operation, children.length);
    }

    // if we were passed an element, add it to the table and add an `OidRef` to the parent.
    if (child instanceof JSXElement) {
      this.addElement(child);
      child = new OidRef(child.oid);
    }

    // create a new array and add to that
    parent._children = Array.from(parent._children);
    parent._children.splice(position, 0, child);
  }

  // Remove a a `child` from `parent`.
  // Pass a `JSXElement`, an `OidRef` or a literal to remove (we'll remove the first one found).
  // NOTE: removes `JSXElement` or `OidRef` from the `oids` table as well.
  // Throws if `child` not found.
  removeChild(parentOid, child) {
    const parent = this._getElementOrDie(parentOid, "removeChild", "parent not found");
    if (!parent._children) this._die("removeChild", arguments, "parent has no children");

    let position;
    if (child && child.oid) {
      position = parent._children.findIndex( next => next.oid === child.oid );
    }
    else {
      position = parent._children.indexOf(child);
    }
    return this.removeChildAtPosition(parent, position);
  }

  // Remove a the child at `position` from `parent`.
  // Returns the child so removed, if any.
  // NOTE: if the child is an `OidRef`, removes the corresponding JSXElement from our `oids`.
  // Throws if `position` is outside the current range of the parent or is otherwise wonky.
  removeChildAtPosition(parentOid, position) {
    const parent = this._getElementOrDie(parentOid, "removeChildAtPosition", "parent not found");
    this._dieIfInvalidChildPosition(parent, position, "removeChild");

    const child = parent._children[position];

    // duplicate children array and remove the child
    parent._children = Array.from(parent._children);
    parent._children.splice(position, 1);

    // remove from the oids table
    if (child && child.oid) this.remove(child);

    return child;
  }




  //////////////////////////////
  //  Standardized morbidity is a terrible thing
  //////////////////////////////

  _die(operation, args, message = "") {
    const messages = [`${this}.${operation}(`, (args || ""), `): ${message}`];
    console.error(...messages);
    console.trace();
    throw new TypeError(messages.join(""));
  }

  _dieIfNoOids(operation, args) {
    if (!this.oids) this._die(operation, args, "no oids!");
  }

  _getElementOrDie(oidOrElement, operation, message = "element not found") {
    this._dieIfNoOids(operation);
    if (oidOrElement instanceof jsxElement) return oid;

    const element = this.getElement(oidOrElement);
    if (!element) {
      this._die(operation, oidOrElement, message);
    }
    return element;
  }

  _dieIfInvalidChildPosition(parent, position, operation, lastPosition) {
    const children = parent._children;
    if (!children) this._die(operation, parent, "parent has no children");

    if (typeof position !== "number") {
      this._die(operation, [parent, position], "position must be a number");
    }

    if (typeof lastPosition !== "number") lastPosition = children.length - 1;

    if (position < 0 || position > lastPosition) {
     this._die(operation, [parent, position], `position out of range [0-${lastPosition}]`);
    }
  }


  //////////////////////////////
  //  Mutation
  //////////////////////////////



  // Notify observers if certain things have changed.
  onChanged(changes, old) {
    super.onChanged(changes, old);
    // If any of our special bits changes, notify.
    // NOTE: we don't notify on the initial load!  (???)
    if (changes.index && old.index) this.onIndexChanged(changes.index, old.index);
    if (changes.jsxElement || changes.script && (old.jsxElement || old.script)) {
      this.onComponentChanged(changes.jsxElement, old.jsxElement);
    }

    // NOTE: we DO notify about style changes on the initial load
    if (changes.styles) this.onStylesChanged(changes.styles, old.styles);
  }

  //////////////////////////////
  //  Component (from JSXE)
  //////////////////////////////

  onComponentChanged(newComponent, oldComponent) {
    this.dirty();
//    console.info("TODO: Instantiate jsxElement ", newComponent);
    this.trigger("componentChanged", newComponent, oldComponent);
  }


  //////////////////////////////
  //  Stylesheet
  //////////////////////////////

  get stylesheetId() { return normalizeIdentifier(this.path) }

  onStylesChanged(newStyles, oldStyles) {
    if (oldStyles) this.dirty();
    console.info(`Updating ${this.type} styles`);
//    console.warn("TODO: use less to convert to scoped styles");
    if (newStyles) {
      browser.createStylesheet(newStyles, this.stylesheetId)
    }
    else {
      browser.removeStylesheet(this.stylesheetId)
    }
    this.trigger("stylesChanged", newStyles, oldStyles);
  }


  //////////////////////////////
  //  Creating the class based on our loaded data
  //////////////////////////////
  get Component() {
    if (!this.isLoaded) return Stub;
    if (!this.cache.Component) {
      this.cache.Component = this._createComponent();
    }
    return this.cache.Component
  }

  getConstructorName() {
    return this.type + "_"+this.path;
  }

  // Actually create the Component based on what we've loaded.
  // Your subclass may want to override this to add additional stuff to the Constructor.
  _createComponent() {
    let Constructor;
    const componentName = this.getConstructorName();
    try {
      // if we have a jsxElement, create the classs and set its renderMethod
      if (this.jsxElement) {
        // NOTE: we have to manually stick in a `render()` function here
        //       because React barfs if we try to set `render()` directly.
        let script = [
          this.script || "",
          "render() { return this.__render() }"
        ].join("\n");
        Constructor = babel.createClass(script, this.SuperConstructor, componentName);

        // Get the `__render` routine from the jsxElement
        Constructor.prototype.__render = this.jsxElement.getRenderMethod();

        // make sure we've got a `createElement` routine since `_renderChildren` expects one.
        if (!Constructor.prototype.createElement) {
          Constructor.prototype.createElement = function(type, props, ...children) {
            return React.createElement(type, props, ...children);
          }
        }
      }
      // otherwise if we have a `script`, assume it's a full ES2015 class expression (????)
      else if (this.jsx) {
        Constructor = babel.evaluate(this.jsx);
      }
      // ????
      else {
        console.error("ComponentLoader: Don't know how to make constructor for ", this);
        throw new TypeError("Unable to make constructor");
      }
    }
    catch (error) {
      console.error("Error creating component constructor: ", error);
      throw error;
    }

    Constructor.controller = this.controller;
    return Constructor;
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////
  toString() {
    return `[${this.type} ${this.path}]`;
  }

}

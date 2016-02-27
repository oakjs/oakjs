//////////////////////////////
//
//  ComponentLoader class
//
//  Loads a component from a bundle, vends a `ComponentConstructor`.
//
//////////////////////////////

import React from "react";

import Loadable from "oak-roots/Loadable";
import Mutable from "oak-roots/Mutable";
import Savable from "oak-roots/Savable";

import babel from "oak-roots/util/babel";
import browser from "oak-roots/util/browser";
import objectUtil from "oak-roots/util/object";

import Stub from "./components/Stub";



export default class ComponentLoader extends Savable(Loadable(Mutable)) {

  //////////////////////////////
  //  Creation / destruction
  //////////////////////////////

  constructor(...args) {
    super(...args);
  }

  destroy() {
    if (this.styles) browser.removeStylesheet(this.stylesheetId);
  }


  //////////////////////////////
  //  Identify syntactic sugar
  //////////////////////////////

  // Note: you SHOULD override this with the `type` of your component, eg: "card" or "stack"
  get type() { return "component" }

  get id() { throw "You must override `get id()`" }
  get path() { throw "You must override `get path()`" }

  get selector() { throw "You must override `get selector()`" }

  get title() { return ( this.props && this.props.title ) || this.id }

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
  //  Child index
  //////////////////////////////

  onIndexChanged(newIndex, oldIndex) {
    this.dirty();
//    console.info("TODO: Instantiate index ", newIndex);
    this.trigger("indexChanged", newIndex, oldIndex);
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

  get stylesheetId() { return "STYLE-" + this.path.replace(/\//g, "-") }
  onStylesChanged(newStyles, oldStyles) {
    if (oldStyles) this.dirty();
    console.info(`Updating ${this.type} styles`);
//    console.warn("TODO: use less to convert to scoped styles");
    if (newStyles) {
      browser.createStylesheet(newStyles || "", this.stylesheetId)
    }
    else {
      browser.removeStylesheet(this.stylesheetId)
    }
    this.trigger("stylesChanged", newStyles, oldStyles);
  }


  //////////////////////////////
  //  Creating the class based on our loaded data
  //////////////////////////////
  get ComponentConstructor() {
    if (!this.isLoaded) return Stub;
    if (!this.cache.Constructor) {
      this.cache.Constructor = this._createComponentConstructor();
    }
    return this.cache.Constructor
  }

  // Actually create the ComponentConstructor based on what we've loaded.
  // Your subclass may want to override this to add additional stuff to the Constructor.
  _createComponentConstructor(Super = React.Component, ComponentName = "Component") {
    let Constructor
    try {
      // if we have a jsxElement, create the classs and set its renderMethod
      if (this.jsxElement) {
        // NOTE: we have to manually stick in a `render()` function here
        //       because React barfs if we try to set `render()` directly.
        let script = [
          this.script || "",
          "render() { return this._renderChildren() }"
        ].join("\n");
        Constructor = babel.createClass(script, Super, ComponentName);

        // Get the `_renderChildren` routine from the jsxElement
        Constructor.prototype._renderChildren = this.jsxElement.getRenderMethod();

        // make sure we've got a `createElement` routine since `_renderChildren` expects one.
        if (!Constructor.prototype) {
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
        console.error("Don't know how to make constructor for ", this);
        throw new TypeError("Unable to make constructor");
      }
    }
    catch (error) {
      console.error("Error creating component constructor: ", error);
      throw error;
    }

    window.Constructor = Constructor;
    return Constructor;
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////
  toString() {
    return `[${this.constructor.name} ${this.path}]`;
  }

}

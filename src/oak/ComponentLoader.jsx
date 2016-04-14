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
import ids from "oak-roots/util/ids";
import { dieIfMissing } from "oak-roots/util/die";

import api from "./api";
import JSXElement from "./JSXElement";
import JSXFragment from "./JSXFragment";

import Stub from "./components/Stub";



export default class ComponentLoader extends Savable(Loadable(Mutable)) {

  //////////////////////////////
  //  Creation / destruction
  //////////////////////////////

  constructor(...args) {
    super(...args);
    dieIfMissing(this, "constructor", ["controller", "SuperConstructor", "type", "path"]);
  }

  destroy() {
    if (this.styles) browser.removeStylesheet(this.stylesheetId);
  }

  get jsxElement() { return this.jsxFragment.root }
  get oids() { return this.jsxFragment.oids }

  //////////////////////////////
  //  Loading
  //////////////////////////////
  loadData() {
    return api.loadComponentBundle(this.controller)
      .then(bundle => {
        if (bundle.jsxe) {
          try {
            // parse the `jsxe` into a `JSXFragment`
            bundle.jsxFragment = JSXFragment.parse(bundle.jsxe);
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
  //  Finding / manipulating elements
  //////////////////////////////

  @autobind
  getElement(oid) {
    if (oid instanceof JSXElement) return oid;
    if (!oid || !this.oids) return undefined;
    return this.oids[oid];
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
    if (changes.jsxFragment || changes.script && (old.jsxFragment || old.script)) {
      this.onComponentChanged(changes.jsxFragment, old.jsxFragment);
    }

    // NOTE: we DO notify about style changes on the initial load
    if (changes.styles) this.onStylesChanged(changes.styles, old.styles);
  }

  //////////////////////////////
  //  Component (from JSXE)
  //////////////////////////////

  onComponentChanged(newComponent, oldComponent) {
    this.resetCache();
    this.dirty();
//    console.info("TODO: Instantiate jsxFragment ", newComponent);
    this.trigger("componentChanged", newComponent, oldComponent);
  }


  //////////////////////////////
  //  Stylesheet
  //////////////////////////////

  get stylesheetId() { return ids.normalizeIdentifier(this.path) }

  onStylesChanged(newStyles, oldStyles) {
    if (oldStyles) this.dirty();
//    console.info(`Updating ${this.type} styles`);
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
//console.info("creating component ",componentName);
    try {
      // if we have a jsxFragment, create the classs and set its renderMethod
      if (this.jsxFragment) {
        // NOTE: we have to manually stick in a `render()` function here
        //       because React barfs if we try to set `render()` directly.
        let script = [
          this.script || "",
          "render() { return this.__render() }"
        ].join("\n");
        Constructor = babel.createClass(script, this.SuperConstructor, componentName);

        // Get the `__render` routine from the jsxElement
        Constructor.prototype.__render = this.jsxFragment.root.getRenderMethod();

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

//////////////////////////////
//
//  ComponentController class
//
//  Base class for ProjectController, StackController, CardController, ProjectController.
//
//////////////////////////////

import React from "react";

import Loadable from "oak-roots/Loadable";
import Mutable from "oak-roots/Mutable";
import Savable from "oak-roots/Savable";

import { browser, objectUtil } from "oak-roots";

import Stub from "./components/Stub";



export default class ComponentController extends Savable(Loadable(Mutable)) {

  //////////////////////////////
  //  Creation / destruction
  //////////////////////////////

  constructor(props) {
    super(props);
  }

  destroy() {
    if (this.styles) browser.removeStylesheet(this.stylesheetId);
  }


  //////////////////////////////
  //  Identify syntactic sugar
  //////////////////////////////

  // Note: you SHOULD override this with the `type` of your component, eg: "card" or "stack"
  static type = "component";
  get type() { return this.constructor.type }

  // Note: you MUST override this with your component constructor.
  static baseComponentConstructor = React.Component;

  get id() { throw "You must override `get id()`" }
  get path() { throw "You must override `get path()`" }

  get selector() { throw "You must override `get selector()`" }
  get rootSelector() { return (this.parent ? this.parent.rootSelector + " " : "") + this.selector }


  //////////////////////////////
  //  Mutation
  //////////////////////////////

  // Notify observers if certain things have changed.
  onChanged(changes, old) {
    super.onChanged(changes, old);
    // If any of our special bits changes, notify.
    // NOTE: we don't notify on the initial load!  (???)
    if (changes.index && old.index) this.onIndexChanged(changes.index, old.index);
    if (changes.component || changes.script && (old.component || old.script)) this.onComponentChanged(changes.component, old.component);
    if (changes.styles && old.styles) this.onStylesChanged(changes.styles, old.styles);
  }

  //////////////////////////////
  //  Child index
  //////////////////////////////

  onIndexChanged(newIndex, oldIndex) {
    this.dirty();
    console.info("TODO: Instantiate index ", newIndex);
    this.trigger("indexChanged", newIndex, oldIndex);
  }

  //////////////////////////////
  //  Component (from JSXE)
  //////////////////////////////

  onComponentChanged(newComponent, oldComponent) {
    this.dirty();
    console.info("TODO: Instantiate component ", newComponent);
    this.trigger("componentChanged", newComponent, oldComponent);
  }


  //////////////////////////////
  //  Stylesheet
  //////////////////////////////

  get stylesheetId() { return "STYLE-" + this.path.replace(/\//g, "-") }
  onStylesChanged(newStyles, oldStyles) {
    if (oldStyles) this.dirty();
    console.info(`Updating ${this.type} styles`);
    console.warn("TODO: use less to convert to scoped styles");
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
    if (!this.component) return Stub;
    if (!this.cache.Constructor) {
      console.info("Creating Constructor");
      console.warn("TODO: use babel to allow us to use ES2015 scripts");
      const BaseComponent = this.constructobaseComponentConstructor;
      const Constructor = class ComponentConstructor extends BaseComponent {};
      console.info(Constructor.prototype.render);
      Constructor.prototype.render = this.component.getRenderMethod();
      console.log(Constructor.prototype.render);
      this.cache.Constructor = Constructor;
      Constructor.controller = this;
    }
    return this.cache.Constructor
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////
  toString() {
    return `[${this.constructor.name} ${this.path}]`;
  }

}

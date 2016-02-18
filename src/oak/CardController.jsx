//////////////////////////////
// CardController class
//////////////////////////////

import React from "react";

import Card from "./Card";
import JSXElement from "./JSXElement";
import Loadable from "./Loadable";
import Mutable from "./Mutable";
import Savable from "./Savable";
import Stub from "./components/Stub";

import ajax from "./util/ajax";
import browser from "./util/browser";
import objectUtil from "./util/objectUtil";


class CardController extends Savable(Loadable(Mutable)) {

  //////////////////////////////
  //  Creation / destruction
  //////////////////////////////

  constructor(props) {
    super(props);
  }

  destroy() {
    if (this.style) browser.removeStylesheet(this.stylesheetId);
  }


  //////////////////////////////
  //  Identify syntactic sugar
  //////////////////////////////

  get cardPath() { return `${this.projectId}/${this.stackId}/${this.cardId}` }

  get cardId() { return this.attributes.card }
  get stackId() { return this.attributes.stack }
  get projectId() { return this.attributes.project }

  dieIfNotIdentified() {
    const missing = [];
    if (!this.cardId) missing.push("cardId");
    if (!this.stackId) missing.push("stackId");
    if (!this.projectId) missing.push("projectId");
    if (missing.length) throw new TypeError("CardController has no " + missing.join(", "));
  }


  //////////////////////////////
  //  Mutation
  //////////////////////////////

  // Notify observers if certain things have changed.
  onChanged(changes, old) {
    super.onChanged(changes, old);
    const { component, style, script } = changes;
    if (component || script) this.onComponentChanged(component, old.component);
    if (style) this.onStyleChanged(style, old.style);
  }

  onComponentChanged(newComponent, oldComponent) {
    if (oldComponent) this.isDirty = true;
    console.info("TODO: Instantiate component ", newComponent);
    this.trigger("componentChanged", newComponent);
  }

  onStyleChanged(newStyle, oldStyle) {
    if (oldStyle) this.isDirty = true;
    console.log("Updating card style");
    console.warn("TODO: use less to convert to scoped styles");
    browser.createStylesheet(newStyle || "", this.stylesheetId)
  }

  get cardSelector() { return `.oak.Project#${this.projectId} .oak.Stack#${this.stackId} .oak.Card#${this.cardId}` }
  get stylesheetId() { return this.cardPath.replace(/\//g, "-") }


  //////////////////////////////
  //  Creating the class based on our loaded data
  //////////////////////////////
  get CardConstructor() {
    if (!this.component) return Stub;
    if (!this.cache.CardConstructor) {
      console.log("Creating CardConstructor");
      console.warn("TODO: use babel to allow us to use ES2015 scripts");
      // TODO: if we have a script, use Babel to create the class
      const Constructor = class CardConstructor extends Card {};
      Constructor.prototype.render = this.component.getRenderMethod();
      this.cache.CardConstructor = Constructor;
      Constructor.controller = this;
    }
    return this.cache.CardConstructor
  }



  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    try {
      this.dieIfNotIdentified();
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.all([this.loadComponent(), this.loadStyle(), this.loadScript()])
      .then(([component, style, script]) => {
        return { component, style, script }
      });
  }

  onLoaded(data) {
console.warn("onLoaded:", data);
    this.mutate(data);
  }

  saveData() {
    try {
      this.dieIfNotIdentified();
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.all([this.saveComponent(), this.saveStyle(), this.saveScript()]);
  }

  // Component file
  get componentUrl() {
    return `/api/jsxe/${this.projectId}/${this.stackId}/${this.cardId}`;
  }
  loadComponent() {
    return ajax.fetchText(this.componentUrl)
            .catch(error => {
              console.error(`Error (${error.status}) returned when loading card component file from '${this.componentUrl}'`);
              throw new ReferenceError("Could not load card.")
            })
            // Go from JSX to a JSXElement
            // If the JSX didn't actually change, keep the same element!
            .then(jsxe => {
              if (this.component && this.component.toString() === jsxe) return this.component;
              try {
                return JSXElement.parse(jsxe);
              }
              catch (e) {
                console.group(`Error parsing JSXE file from ${this.componentUrl}`);
                console.error(e);
                console.groupEnd();
                throw new ReferenceError("Could not load card.")
              }
            });
  }
  saveComponent() {
    if (this.component === undefined) return;
    console.info("Saving component");
    return ajax.saveText(this.component.toString(), this.componentUrl);
  }

  // CSS file
  get styleUrl() {
    return `/api/css/${this.projectId}/${this.stackId}/${this.cardId}`
  }
  loadStyle() {
    return ajax.fetchText(this.styleUrl)
            .catch( error => { return undefined });
  }
  saveStyle() {
    if (this.style === undefined) return;
    console.info("Saving style");
    return ajax.saveText(this.style, this.styleUrl);
  }

  // Script file
  get scriptUrl() {
    return `/api/script/${this.projectId}/${this.stackId}/${this.cardId}`
  }
  loadScript() {
    return ajax.fetchText(this.scriptUrl)
            .catch( error => { return undefined });
  }
  saveScript() {
    if (this.script === undefined) return;
    console.info("Saving script");
    return ajax.saveText(this.script, this.scriptUrl);
  }



}

export default CardController;

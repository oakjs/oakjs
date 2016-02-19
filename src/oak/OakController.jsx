//////////////////////////////
//
//  OakController class
//
//  Base class for ProjectController, StackController, CardController, ProjectController.
//
//////////////////////////////

import JSXElement from "./JSXElement";
import Loadable from "./Loadable";
import Mutable from "./Mutable";
import Savable from "./Savable";
import Stub from "./components/Stub";

import ajax from "./util/ajax";
import browser from "./util/browser";
import objectUtil from "./util/objectUtil";


class OakController extends Savable(Loadable(Mutable)) {

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

  get type() { throw "You must override `get type()`" }
  get baseComponentConstructor() { throw "You must override `get baseComponentConstructor()`" }

  get id() { throw "You must override `get id()`" }
  get path() { throw "You must override `get path()`" }

  get rootSelector() { throw "You must override `get rootSelector()`" }
  get stylesheetId() { return "STYLE-" + this.id }


  // Die if your component is not fully identified.
  // See `CardComponent` for an example.
  dieIfNotIdentified(errorMessage) {}


  //////////////////////////////
  //  Mutation
  //////////////////////////////

  // Notify observers if certain things have changed.
  onChanged(changes, old) {
    super.onChanged(changes, old);
    const { childIndex, component, style, script } = changes;
    if (childIndex) this.onChildIndexChanged(childIndex, old.childIndex);
    if (component || script) this.onComponentChanged(component, old.component);
    if (style) this.onStyleChanged(style, old.style);
  }

  onChildIndexChanged(newChildIndex, oldChildIndex) {
    if (oldChildIndex) this.dirty();
    console.info("TODO: Instantiate childIndex ", newChildIndex);
    this.trigger("childIndexChanged", newChildIndex);
  }

  onComponentChanged(newComponent, oldComponent) {
    if (oldComponent) this.dirty();
    console.info("TODO: Instantiate component ", newComponent);
    this.trigger("componentChanged", newComponent);
  }

  onStyleChanged(newStyle, oldStyle) {
    if (oldStyle) this.dirty();
    console.info(`Updating ${this.type} style`);
    console.warn("TODO: use less to convert to scoped styles");
    if (newStyle) {
      browser.createStylesheet(newStyle || "", this.stylesheetId)
    }
    else {
      browser.removeStylesheet(this.stylesheetId)
    }
    this.trigger("styleChanged", newStyle);
  }



  //////////////////////////////
  //  Creating the class based on our loaded data
  //////////////////////////////
  get ComponentConstructor() {
    if (!this.component) return Stub;
    if (!this.cache.Constructor) {
      console.info("Creating Constructor");
      console.warn("TODO: use babel to allow us to use ES2015 scripts");
      // TODO: if we have a script, use Babel to create the class
      const Constructor = class Constructor extends this.baseComponentConstructor {};
      Constructor.prototype.render = this.component.getRenderMethod();
      this.cache.Constructor = Constructor;
      Constructor.controller = this;
    }
    return this.cache.Constructor
  }



  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    this.dieIfNotIdentified(`Error loading ${this}`);
  }

  onLoaded(data) {
console.warn(`${this.type} loaded.  Data: `, data);
    this.mutate(data);
  }

  saveData() {
    this.dieIfNotIdentified(`Error saving ${this.type}`);
  }


  //////////////////////////////
  // Loading / Saving our Component file
  //////////////////////////////
  get componentUrl() {
    return `/api/${this.type}/${this.path}/jsxe`;
  }
  loadComponent() {
    return ajax.fetchText(this.componentUrl)
            .catch(error => {
              console.error(`Error (${error.status}) returned when loading ${this.type} component from '${this.componentUrl}'`);
              throw new ReferenceError(`Could not load ${this.type}.`)
            })
            // Go from JSX to a JSXElement
            // If the JSX didn't actually change, keep the same element!
            .then(jsxe => {
              if (this.component && this.component.toString() === jsxe) return this.component;
              try {
                return JSXElement.parse(jsxe);
              }
              catch (e) {
                console.group(`Error parsing JSXE from ${this.componentUrl}`);
                console.error(e);
                console.groupEnd();
                throw new ReferenceError(`Could not load ${this.type}.`);
              }
            });
  }
  saveComponent() {
    if (this.component === undefined) return;
    console.info(`Saving ${this.type} component`);
    return ajax.saveText(this.component.toString(), this.componentUrl);
  }



  //////////////////////////////
  // Loading / Saving our CSS file
  //////////////////////////////

  get styleUrl() {
    return `/api/${this.type}/${this.path}/css`;
  }
  loadStyle() {
    return ajax.fetchText(this.styleUrl)
            .catch( error => { return undefined });
  }
  saveStyle() {
    if (this.style === undefined) return;
    console.info(`Saving ${this.type} style`);
    return ajax.saveText(this.style, this.styleUrl);
  }


  //////////////////////////////
  // Loading / Saving our Script file
  //////////////////////////////

  get scriptUrl() {
    return `/api/${this.type}/${this.path}/script`;
  }
  loadScript() {
    return ajax.fetchText(this.scriptUrl)
            .catch( error => { return undefined });
  }
  saveScript() {
    if (this.script === undefined) return;
    console.info(`Saving ${this.type} script`);
    return ajax.saveText(this.script, this.scriptUrl);
  }


  //////////////////////////////
  // Loading / Saving our Child Index file
  //////////////////////////////

  get childIndexUrl() {
    return `/api/${this.type}/${this.path}/index`;
  }
  loadChildIndex() {
    return ajax.fetchJSON(this.childIndexUrl)
            .catch(error => {
              console.error(`Error (${error.status}) returned when loading ${this.type} childIndex from '${this.childIndexUrl}'`);
              throw new ReferenceError(`Could not load ${this.type}.`)
            });
  }
  saveChildIndex() {
    if (this.childIndex === undefined) return;
    console.info(`Saving ${this.type} childIndex`);
    return ajax.saveJSON(this.childIndex, this.childIndexUrl);
  }




  //////////////////////////////
  //  Utility
  //////////////////////////////
  dieIfMissing(fields, errorMessage = `Error in ${this.constructor.name}`) {
    const missing = fields.filter(field => this[field] == null);
    if (missing.length) throw new TypeError(errorMessage + ": missing " + missing.join("\n"));
  }


  //////////////////////////////
  //  Debug
  //////////////////////////////
  toString() {
    return `[${this.constructor.name} ${this.id}]`;
  }

}

export default OakController;

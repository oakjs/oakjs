//////////////////////////////
//
// Generic ComponentController class
//
//////////////////////////////

import ChildController from "oak-roots/ChildController";
import Eventful from "oak-roots/Eventful";
import Stylesheet from "oak-roots/Stylesheet";
import { autobind, proto, throttle } from "oak-roots/util/decorators";
import ids from "oak-roots/util/ids";

import api from "./api";
import JSXFragment from "./JSXFragment";
import oak from "./oak";

import Stub from "./components/Stub";


export default class ComponentController extends Eventful(ChildController) {
  // Your subclass should override to add variables that you want to expose to the render() method.
  static renderVars = {
    props: "this.props",
    state: "this.state",
    context: "this.context",
    controller: "context.controller",
    oak: "context.oak",
    page: "context.page",
    section: "context.section",
    project: "context.project",
    components: "context.components",
    data: "this.data || {}"
  };

  constructor(props) {
    super();
    Object.assign(this, props);
    this.cache = {};
  }

  // Return the `type` of this component, which is our generally constructor's name.
  // This will, eg, be used to load the component, for filenames on the server, etc.
  @proto
  type = "Component";

  //////////////////////////////
  //  ChildController stuff
  //////////////////////////////

  // Override to make the index for the children of this Component.
  // If you don't override, we'll assume you don't have any children that you manage.
  // If you do have children, call this in your `constructor` so the index is always available.
  _makeIndex() {}

  // Return the data to save in our PARENT's index for this object.
  // Override if you need to save something else...
  // NOTE: server assumes we're only saving this as well for all components...
  getIndexData() { return { type: this.type, id: this.id, title: this.title } }

  get route() { throw new TypeError("You must implement get route()") }


  //////////////////////////////
  //  Component Sugar
  //////////////////////////////

  // "private" things are findable, but don't show up in menus, etc
  get isPrivate() { return this.id.startsWith("_") }

  // Props come from the root element of our JSXE
  get props() {
    return this.jsxFragment && this.jsxFragment.root.props;
  }

  // State comes from our instantiated component
  get state() { return this.component && this.component.state }
  setState(state) { if (this.component) this.component.setState(state) }
  forceUpdate() { if (this.component) this.component.forceUpdate() }

  // don't call more than once per MSEC
  @throttle(1)
  updateSoon(){ this.forceUpdate() }

  // Refs come from our instantiated component
  get refs() { return this.component ? this.component.refs : {} }

  // Oid of this component
  get oid() {
    const props = this.props;
    return props && (props.oid || props["data-oid"]);
  }

  //////////////////////////////
  //  Components
  //////////////////////////////

  // Called when our component JSX, Script or Styles change.
  // Forces full page update.
  onComponentChanged() {
    if (this.component) oak.updateSoon();
  }

  // Return all `oids` this component knows about.
  get oids() {
    return this.jsxFragment && this.jsxFragment.oids
  }

  // Return the component DEFINITION for the specified `oid`.
  getComponentForOid(oid) {
    const oids = this.oids;
    return oid && oids && oids[oid];
  }

  // Return a list of oids of all of our descendents (not including this node)
  get descendentOids() {
    const oids = Object.keys(this.oids || {});
    const index = oids.indexOf(this.oid);
    if (index > -1) oids.splice(index, 1);
    return oids;
  }

  //////////////////////////////
  //  Loading
  //////////////////////////////

  // We load our data in a JSON bundle.
  // The base class automatically handles:
  //    - `jsxe` as a JSXFragment (override `_loadedJSXE()` to do something slecei
  //    - `script` as javascript for the JSXFragment
  //    - `styles` as CSS styles
  //    - `index` as a LoadableIndex
  loadData() {
    return api.loadComponentBundle({ component: this });
  }

  onLoaded(bundle) {
    if (typeof bundle === "string") bundle = JSON.parse(bundle);

    this.cache = {};
    if (bundle.jsxe) this._loadedJSXE(bundle.jsxe);
    if (bundle.index) this._loadedIndex(bundle.index);
    this._loadedScript(bundle.script);
    this._loadedStyles(bundle.styles);

    this.onComponentChanged();
    return bundle;
  }


  //////////////////////////////
  //  Saving
  //////////////////////////////

  // Return the data to be saved in the JSON bundle.
  // The baseclass saves:
  //    - `jsxe` as a JSXFragment
  //    - `script` as javascript for the JSXFragment
  //    - `styles` as CSS styles
  // If your subclass has an index or something, add that to the `super()`'s data.
  getDataToSave() {
    return {
      jsxe: this._getJSXEData(),
      script: this._getScriptData(),
      styles: this._getStyleData(),
      index: this._getIndexData()
    }
  }

  saveData() {
    const data = this.getDataToSave();
    console.warn(`${this}.saveData(): `, data);
//TODO: update data from returned bundle???
    return api.saveComponentBundle({ component: this, data });
  }

  // Clear our cache when we're marked as dirty
  dirty(dirty) {
    super.dirty(dirty);
    if (this.isDirty) {
      this.cache = {};
      this.onComponentChanged();
    }
  }


  //////////////////////////////
  //  JSXE
  //////////////////////////////

  // Called when your loaded bundle specifies "jsxe".
  _loadedJSXE(jsxe) {
    this.jsxFragment = JSXFragment.parse(jsxe, { controller: this });
  }

  // Return JSXE data to save.
  _getJSXEData() {
    if (this.jsxFragment) return this.jsxFragment.toJSX();
  }

  // Return the Component class for our JSXE, etc.
  get Component() {
    if (this.cacheComponent) return this.cache.Component;

    if (!this.isLoaded || !this.jsxFragment) return Stub;

    if (!this.cache.Component) {
      const superType = this.jsxFragment.root.type;
      const errorMessage = `${this}.Component: can't find component`;
      const Super = oak.lookupComponent(superType, this.components, errorMessage);
      const classId = ids.normalizeIdentifier(`${superType}_${this.path}`);
      const Component = this.jsxFragment.createComponent(classId, Super, this._script);
      Component.controller = this;
      this.cache.Component = Component;
    }

    return this.cache.Component
  }


  //////////////////////////////
  //  Script
  //////////////////////////////

  // Called when your loaded bundle specifies "script".
  _loadedScript(script) {
    this._script = script;
  }

  // Return script data to save.
  _getScriptData() {
    return this._script;
  }

  // Call this to change your Script after you've loaded.
  updateScript(script) {
    this._script = script;
    this.dirty();
  }


  //////////////////////////////
  //  Stylesheets
  //////////////////////////////

  // Called when your loaded bundle specifies "styles".
  _loadedStyles(css) {
    if (!this.stylesheet) {
      if (css) {
        const id = ids.normalizeIdentifier(this.path);
        this.stylesheet = new Stylesheet({css, id });
      }
    }
    else {
      this.stylesheet.update(css);
    }
  }

  // Return stylesheet data to save.
  _getStyleData() {
    if (this.stylesheet) return this.stylesheet.css;
  }

  // Call this to change your CSS after you've loaded.
  updateStyles(css) {
    this._loadedStyles(css);
    this.dirty();
  }


  //////////////////////////////
  //  Debug
  //////////////////////////////

  toString() {
    return `<${this.type} ${this.path}/>`;
  }

}

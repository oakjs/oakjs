//////////////////////////////
//
// Generic ComponentController class
//
//////////////////////////////

import Eventful from "oak-roots/Eventful";
import Loadable from "oak-roots/Loadable";
import Savable from "oak-roots/Savable";
import Stylesheet from "oak-roots/Stylesheet";
import { autobind, proto, throttle } from "oak-roots/util/decorators";
import ids from "oak-roots/util/ids";

import api from "./api";
import JSXFragment from "./JSXFragment";

import Stub from "./components/Stub";


export default class ComponentController extends Savable(Loadable(Eventful())) {
  constructor(props) {
    super();
    Object.assign(this, props);
    this.cache = {};
  }

  @proto
  type = "component";

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

  // Called when our component JSX, Script or Styles change.  Forces full page update.
  onComponentChanged() {
    if (this.component) this.oak.updateSoon();
  }

  // Given a component `type` name, return the component class it corresponds to.
  getComponentConstructorForType(type, errorMessage) {
    return this.oak.getComponentConstructorForType(type, errorMessage, this.components);
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
    return api.loadComponentBundle({ type: this.type, path: this.path });
  }

  onLoaded(bundle) {
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
    console.warn("saving: ", data);
//TODO: update data from returned bundle???
    return api.saveComponentBundle({ type: this.type, path: this.path, data });
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
    this.jsxFragment = JSXFragment.parse(jsxe);
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
      const classId = this.type + "_" +  ids.normalizeIdentifier(this.path);
      const Component = this.jsxFragment.getComponent(classId, this.ComponentSuperConstructor, this._script);
      Component.controller = this;
      this.cache.Component = Component;
    }

    return this.cache.Component
  }


  //////////////////////////////
  //  Index
  //////////////////////////////

  // Override to make the index for this type of thing.
  // Depending on your logic, you may want to call this in your `constructor`
  //  so the index is always available.
  _makeIndex() {
    console.warn("Your subclass must override `_makeIndex()`");
  }

  // Called when your loaded bundle specifies "index".
  _loadedIndex(indexJSON) {
    if (!indexJSON) return;

    if (!this._index) this._index = this._makeIndex();
    this._index.loaded(JSON.parse(indexJSON));
  }

  // Return index data to save.
  _getIndexData() {
    return this._index && this._index.getIndexData();
  }

  // Call this if you change your Index after you've loaded.
  updatedIndex() {
    this.dirty();
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

  //
  //  Stylesheets
  //


}

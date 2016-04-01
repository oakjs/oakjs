//////////////////////////////
// Project class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import LoadableIndex from "oak-roots/LoadableIndex";
import { proto, debounce } from "oak-roots/util/decorators";

import ComponentLoader from "./ComponentLoader";


export default class ComponentController extends Loadable() {
  constructor(props) {
    super();
    Object.assign(this, props);

    this.initComponentLoader();
  }

  @proto
  type = "component";

  // "private" things are findable, but don't show up in menus, etc
  get isPrivate() { return this.id.startsWith("_") }

  //////////////////////////////
  //  Component Sugar
  //////////////////////////////

  get jsxElement() { return this.componentLoader && this.componentLoader.jsxElement }

  // Props come from the root element of our JSXE
  get props() {
    const jsxElement = this.jsxElement;
    if (jsxElement) return this.jsxElement.props;
  }

  // State comes from our instantiated component
  get state() { return this.component ? this.component.state : {} }

  // Refs come from our instantiated component
  get refs() { return this.component ? this.component.refs : {} }


  //////////////////////////////
  //  Components
  //////////////////////////////

  initComponentLoader() {
    this.componentLoader = this.getComponentLoader();

    // watch componentChanged to update our element
    this.componentLoader.on("componentChanged", () => this.onComponentChanged() );
  }

  getComponentLoader() {
    throw new TypeError(`You must override ${this}.getComponentLoader()`);
  }

  onComponentChanged() {
    if (this.component) this.oak.updateSoon();
  }

  get Component() { return this.componentLoader.Component }

  // Given a component `type` name, return the component class it corresponds to.
  getThemeComponentForType(type, errorMessage) {
    return this.oak.getThemeComponentForType(type, errorMessage, this.components);
  }

  // Return the component DEFINITION for the specified `oid`.
  getComponentForOid(oid) {
    return oid
        && this.componentLoader
        && this.componentLoader.oids
        && this.componentLoader.oids[oid];
  }

  //////////////////////////////
  //  Loading
  //////////////////////////////

  loadData() {
    return Promise.all([
        this.componentLoader.load(),
      ])
      .then(() => this );
  }

}

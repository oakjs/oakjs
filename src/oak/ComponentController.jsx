//////////////////////////////
// Project class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import LoadableIndex from "oak-roots/LoadableIndex";
import { proto, throttle } from "oak-roots/util/decorators";

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

  get jsxFragment() { return this.componentLoader && this.componentLoader.jsxFragment }

  // Props come from the root element of our JSXE
  get props() {
    const jsxFragment = this.jsxFragment;
    if (jsxFragment) return jsxFragment.root.props;
  }

  // State comes from our instantiated component
  get state() { return this.component && this.component.state }
  setState(state) { if (this.component) this.component.setState(state) }
  forceUpdate() { if (this.component) this.component.forceUpdate() }
  @throttle(1)
  updateSoon(){ this.forceUpdate() }

  // Refs come from our instantiated component
  get refs() { return this.component ? this.component.refs : {} }

  get oid() {
    const props = this.props;
    return props && (props.oid || props["data-oid"]);
  }

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
  getComponentConstructorForType(type, errorMessage) {
    return this.oak.getComponentConstructorForType(type, errorMessage, this.components);
  }

//DEPRECATE?
  // Return all `oids` this component knows about.
  get oids() {
    return this.componentLoader && this.componentLoader.oids
  }

  // Return the component DEFINITION for the specified `oid`.
  getComponentForOid(oid) {
    const oids = this.oids;
    return oid && oids && oids[oid];
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

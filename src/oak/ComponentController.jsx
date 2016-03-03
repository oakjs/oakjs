//////////////////////////////
// Project class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import LoadableIndex from "oak-roots/LoadableIndex";
import { proto } from "oak-roots/util/decorators";

import ComponentLoader from "./ComponentLoader";


export default class ComponentController extends Loadable() {
  constructor(props) {
    super();
    Object.assign(this, props);
  }

  @proto
  type = "component";

  //////////////////////////////
  //  Component Sugar
  //////////////////////////////

  get jsxElement() { return this.componentLoader && this.componentLoader.jsxElement }

  // Props come from the root element of our JSXE
  get props() {
    const jsxElement = this.jsxElement;
    if (jsxElement) return this.jsxElement.attributes;
  }

  // State comes from our instantiated component
  get state() { return this.component ? this.component.state : {} }

  // Refs come from our instantiated component
  get refs() { return this.component ? this.component.refs : {} }


  //////////////////////////////
  //  Components
  //////////////////////////////

  get Component() { return this.componentLoader.Component }

  getComponentForType(type, errorMessage) {
    return this.app.getComponentForType(type, errorMessage, this.components);
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

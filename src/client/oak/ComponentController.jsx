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
    this.initializeComponentLoader();
  }

  @proto
  type = "component";

  //////////////////////////////
  //  Component Sugar
  //////////////////////////////

  // Props come from the root element of our JSXE
  get props() {
    return this.componentLoader && this.componentLoader.jsxElement && this.componentLoader.jsxElement.attributes;
  }

  // State comes from our instantiated component
  get state() { return this.component ? this.component.state : {} }

  // Refs come from our instantiated component
  get refs() { return this.component ? this.component.refs : {} }


  //////////////////////////////
  //  Components
  //////////////////////////////

  // Subclass this to return your specific ComponentLoader type as necessary.
  initializeComponentLoader() {
    this.componentLoader = new ComponentLoader({ controller: this });
  }

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

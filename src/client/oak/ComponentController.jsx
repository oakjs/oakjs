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
    this.cache = {};
    this.initializeComponentLoader();
  }

  @proto
  type = "component";

  //////////////////////////////
  //  Component Sugar
  //////////////////////////////

  get props() {
    return this.componentLoader && this.componentLoader.jsxElement && this.componentLoader.jsxElement.attributes;
  }
  get state() { return this.component ? this.component.state : {} }
  get refs() { return this.component ? this.component.refs : {} }


  getComponent(type, errorMessage) {
    return this.app.getComponent(type, errorMessage, this.components);
  }

  get ComponentConstructor() { return this.componentLoader.ComponentConstructor }

  //////////////////////////////
  //  Loading
  //////////////////////////////

  // Subclass this to return your specific ComponentLoader type as necessary.
  initializeComponentLoader() {
    this.componentLoader = new ComponentLoader({ controller: this });
  }

  loadData() {
    return Promise.all([
        this.componentLoader.load(),
      ])
      .then(() => this );
  }

}

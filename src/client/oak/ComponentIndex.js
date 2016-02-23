//////////////////////////////
//
//  ComponentIndex class
//
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import Mutable from "oak-roots/Mutable";
import Registry from "oak-roots/Registry";
import Savable from "oak-roots/Savable";

export default class ComponentIndex extends Savable(Loadable(Mutable)) {
  constructor(...args) {
    super(...args);
    this.registry = new Registry();
  }

  //////////////////////////////
  //  Dealing with components
  //////////////////////////////

  get ids() { return this.index && Object.keys(this.index) }

  // Given a component string id or numeric index, return the `component.id`
  //  but only if the component is known to us!
  // NOTE: always returns `undefined` if we haven't loaded yet.
  idForIdentifier(componentIdentifier) {
    if (this.index) {
      switch (typeof componentIdentifier) {
        case "string":
          return (this.index[componentIdentifier] ? componentIdentifier : undefined);
        case "number":
          return this.ids[componentIdentifier];
        default:
          console.error(`${this}.idForIdentifier(): identifier '${componentIdentifier}' not understood`);
      }
    }
    return undefined;
  }

  // Return a component singleton for a project specified by id or index,
  // but only if it's already loaded.
  get(componentIdentifier) {
    const componentId = this.idForIdentifier(componentIdentifier);
    if (componentId) return this.registry.get(componentId);
  }

  // Return a promise which makes an component and loads it.
  // If you call with the same `componentIdentifier` later, you'll get the same object back.
  loadComponent(componentIdentifier) {
    const component = this.get(componentIdentifier);
    if (component) return component.load();

    return this.load()
      .then( () => {
        const componentId = this.idForIdentifier(componentIdentifier);
        // Bail if we can't find the component in the index
        if (!componentId) {
          throw new ReferenceError(`Component '${componentIdentifier}' not found`);
        }

        let component = this.registry.get(componentId);
        if (!component) {
          component = this._makeComponent(componentId, this.index[componentId]);
          this.registry.add(component, componentId);
        }
        return component.load();
      });
  }

  // Actually make a component.
  // NOTE: you should NOT call this, use `get()` or `loadComponent()` instead!
  _makeComponent(componentId, props) {
    throw "You must override _makeComponent"
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.loadComponentIndex(this)
    .then(index => {
      this.mutate({ index });
      return this;
    });
  }

  unload() {
    this.mutate({ index: undefined });
    super.unload();
  }

  saveData() {
    return api.saveComponentIndex(this)
  }

  //////////////////////////////
  //  Reflection
  //////////////////////////////
  toString() {
    return this.constructor.name;
  }

}

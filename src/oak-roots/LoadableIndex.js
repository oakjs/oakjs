//////////////////////////////
//
//  LoadableIndex class
//
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import objectUtil from "oak-roots/util/object";

import Eventful from "oak-roots/Eventful";
import Loadable from "oak-roots/Loadable";
import Registry from "oak-roots/Registry";

export default class LoadableIndex extends Loadable(Eventful()) {
  constructor(props) {
    super();
    Object.assign(this, props);
    objectUtil.dieIfMissing(this, ["itemType", "createChild", "loadIndex"]);
    this.registry = new Registry();
  }

  get ids() { return this.index && Object.keys(this.index) }

  // Given a string id or numeric index, return the `id`
  //  but only if the item is known to us!
  // NOTE: always returns `undefined` if we haven't loaded yet.
  idForIdentifier(itemIdentifier) {
    if (this.index) {
      switch (typeof itemIdentifier) {
        case "string":
          return (this.index[itemIdentifier] ? itemIdentifier : undefined);
        case "number":
          return this.ids[itemIdentifier];
        default:
          console.error(`${this}.idForIdentifier(): identifier '${itemIdentifier}' not understood`);
      }
    }
    return undefined;
  }

  // Return a item singleton for a project specified by id or index,
  // but only if it's already loaded.
  getItem(itemIdentifier) {
    const itemId = this.idForIdentifier(itemIdentifier);
    if (itemId) return this.registry.get(itemId);
  }

  // Return a promise which makes an item and loads it.
  // If you call with the same `itemIdentifier` later, you'll get the same object back.
  loadItem(itemIdentifier) {
    const item = this.getItem(itemIdentifier);
    if (item) return item.load();

    return this.load()
      .then( () => {
        const itemId = this.idForIdentifier(itemIdentifier);
        // Bail if we can't find the item in the index
        if (!itemId) {
          throw new ReferenceError(`${this.itemType} '${itemIdentifier}' not found`);
        }

        let item = this.registry.get(itemId);
        if (!item) {
          item = this.createChild(this, itemId, this.index[itemId]);
          this.registry.add(item, itemId);
        }
        return item.load();
      });
  }

  //////////////////////////////
  //  Loading
  //////////////////////////////

  loadData() {
    return this.loadIndex()
    .then(index => {
      this.index = index;
      return this;
    });
  }

  unload() {
    delete this.index;
    super.unload();
  }

  //////////////////////////////
  //  Reflection
  //////////////////////////////
  toString() {
    return `[${this.itemType} LoadableIndex]`;
  }

}

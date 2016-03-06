//////////////////////////////
//
//  LoadableIndex class
//
//////////////////////////////

import { dieIfMissing } from "oak-roots/util/die";

import Eventful from "oak-roots/Eventful";
import Loadable from "oak-roots/Loadable";
import Registry from "oak-roots/Registry";

// REFACTOR:   Convert from JSON blobs to items when loading index?
// REFACTOR:   Delta index and announce when things are added/removed/moved
// REFACTOR:   Index to array of objects

export default class LoadableIndex extends Loadable() {
  constructor(props) {
    super();
    Object.assign(this, props);
    dieIfMissing(this, "constructor", ["itemType", "createItem", "loadIndex"]);
    this.registry = new Registry();
  }

  // Return an array of all of our known item ids
  // Returns an empty array if we haven't loaded.
  get itemIds() { return (this.index && Object.keys(this.index)) || [] }

  // Return an array of all of our items, creating them if necessary.
  get items() {
    return this.itemIds.map( itemId => this._getOrCreateItem(itemId) );
  }

  // Return a map of `{ itemId => item }` for all of our items, creating them if necessary
  get itemMap() {
    const itemMap = {};
    this.itemIds.forEach( itemId => {
      itemMap[itemId] = this._getOrCreateItem(itemId);
    });
    return itemMap;
  }

  // Given a string id or numeric index, return the `id`
  //  but only if the item is known to us!
  // NOTE: always returns `undefined` if we haven't loaded yet.
  idForIdentifier(itemIdentifier) {
    if (this.index) {
      switch (typeof itemIdentifier) {
        case "string":
          return (this.index[itemIdentifier] ? itemIdentifier : undefined);
        case "number":
          return this.itemIds[itemIdentifier];
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
    if (!itemId) return undefined;
    return this.registry.get(itemId);
  }

  // DO NOT CALL THIS!
  _getOrCreateItem(itemId) {
    let item = this.registry.get(itemId);
    if (!item) {
      item = this.createItem(itemId, this.index[itemId]);
      this.registry.add(item, itemId);
    }
    return item;
  }

  // Return a promise which makes an item and loads it.
  // NOTE: the promise resolves with the ITEM, not with the item's loaded data.
  // If you call with the same `itemIdentifier` later, you'll get the same object back.
  loadItem(itemIdentifier) {
    const item = this.getItem(itemIdentifier);
    if (item) return item.load().then(item => item);

    return this.load()
      .then( () => {
        const itemId = this.idForIdentifier(itemIdentifier);
        // Bail if we can't find the item in the index
        if (!itemId) {
          throw new ReferenceError(`${this.itemType} '${itemIdentifier}' not found`);
        }

        const item = this._getOrCreateItem(itemId);
        return item.load().then(item => item);
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

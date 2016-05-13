//////////////////////////////
//
//  LoadableIndex class
//
//  Assumes that the `json` file is an array of items, each of which has an `id` parameter.
//  This class works by dependency injection, you MUST pass the following routines on creation:
//    - loadData()
//    - createItem()
//
//////////////////////////////

import { dieIfMissing } from "oak-roots/util/die";
import { proto } from "oak-roots/util/decorators";

import Eventful from "oak-roots/Eventful";
import Loadable from "oak-roots/Loadable";

// REFACTOR:   Convert from JSON blobs to items when loading index?
// REFACTOR:   Delta index and announce when things are added/removed/moved
// REFACTOR:   Index to array of objects

export default class LoadableIndex extends Loadable() {
  constructor(props) {
    super();
    Object.assign(this, props);
    dieIfMissing(this, "constructor", ["itemType", "createItem", "loadData"]);
  }

  // If `true`, `getItem()` and `loadItem()` will use 1-based numbering.
  @proto
  useOneBasedNumbering = false;

  // Return a item singleton specified by string id or numeric index.
  // If not found, returns `undefined`.
  // Always returns `undefined` if we haven't already loaded.
  //
  // NOTE: if `useOneBasedNumbering` is true, first item in the list is index `1`.
  getItem(itemIdentifier) {
    if (!this.isLoaded) return undefined;

    if (typeof itemIdentifier === "string") {
      return this._registry[itemIdentifier];
    }
    else if (typeof itemIdentifier === "number") {
      const delta = (this.useOneBasedNumbering ? -1 : 0);
      return this.items[itemIdentifier + delta];
    }

    throw new TypeError(`${this}.getItem(${itemIdentifier}): identifier not understood`);
  }

  // Return a promise which makes an item and loads it.
  // NOTE: the promise resolves with the ITEM, not with the item's loaded data.
  // If you call with the same `itemIdentifier` later, you'll get the same object back.
  loadItem(itemIdentifier) {
    if (this.isLoaded) {
      const item = this.getItem(itemIdentifier);
      if (item) return item.load().then(result => item);
      return Promise.reject(`${this.itemType} '${itemIdentifier}' not found`);
    }
    else {
      return this.load()
        .then( () => this.loadItem(itemIdentifier) );
    }
  }

  // Change the id of some item `fromId` `toId`.
  // NOTE: does not change the INTERNAL id of the item... ????
  // Returns the item so changed.  Throws if item is not found.
  // Override in your subclass if there's more than one pointer to the object.
  changeId(fromId, toId) {
    if (!this.isLoaded) throw new TypeError(`${this}.changeId(${fromId}, ${toId}): index is not loaded`);

    const item = this.getItem(fromId);
    if (!item) throw new TypeError(`${this}.changeId(${fromId}): item not found`);

    delete this._registry[fromId];
    this._registry[toId] = item;

    return item;
  }

  //////////////////////////////
  //  Loading
  //////////////////////////////

  onLoaded(jsonItems = []) {
    // Previous registry, so we'll re-use items
    const oldRegistry = this._registry || {};

    // `_registry` is a map of `{ id => item }`
    this._registry = {};

    // convert from jsonItems to actual items via injected `createItem()`
    this.items = jsonItems.map(jsonItem => {
      if (!jsonItem) return;
      const { id, ...props } = jsonItem;

      let item = oldRegistry[id] || this.createItem(id, props);
      this._registry[id] = item;
      return item;
    }).filter(Boolean);
  }

  unload() {
    delete this.index;
    super.unload();
  }


  //
  //  data to save
  //

  // Properties to actually save in the index
  // as:  internal object name  : index object name
  indexProperties: {
    "id": "id"
  }
  getIndexData() {
    const inputKey = Object.keys(this.indexProperites);
    return this.items.map( item => {
      const data = {};
      inputKey.forEach(inputKey => {
        const outputKey = this.indexProperites[inputKey];
        data[outputKey] = item[inputKey];
      });
    });
  }


  //////////////////////////////
  //  Reflection
  //////////////////////////////
  toString() {
    return `[${this.itemType} LoadableIndex]`;
  }

}

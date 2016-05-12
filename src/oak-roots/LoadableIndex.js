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

  // Return a item singleton specified by string id or numeric index.
  // If not found, returns `undefined`.
  // Always returns `undefined` if we haven't already loaded.
  getItem(itemIdentifier) {
    if (!this.isLoaded) return undefined;

    if (typeof itemIdentifier === "string") {
      return this._registry[itemIdentifier];
    }
    else if (typeof itemIdentifier === "number") {
      return this.items[itemIdentifier];
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

  //////////////////////////////
  //  Loading
  //////////////////////////////

  onLoaded(jsonItems) {
    // `_registry` is a map of `{ id => item }`
    this._registry = {};

    // convert from jsonItems to actual items via injected `createItem()`
    this.items = jsonItems.map(jsonItem => {
      if (!jsonItem) return;
      const { id, ...props } = jsonItem;

      // re-use the same object we had before if there is one
      if (this._registry[id]) {
        // TODO:  This won't pick up changes from the jsonItem...
        //        How to apply them generically?
        return this._registry[id];
      }
      return (this._registry[id] = this.createItem(id, props));
    }).filter(Boolean);

    // return the index as the result of the load
    return this;
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

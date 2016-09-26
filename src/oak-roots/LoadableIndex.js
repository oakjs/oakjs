//////////////////////////////
//
//  LoadableIndex class
//
//  Assumes that the `json` file is an array of items, each of which has an `id` parameter.
//  This class works by dependency injection, you MUST pass the following routines on creation:
//    - loadData()
//    - createItem()
//    - saveData()
//
//////////////////////////////

import { dieIfMissing } from "oak-roots/util/die";
import { proto } from "oak-roots/util/decorators";

import Loadable from "oak-roots/Loadable";
import Savable from "oak-roots/Savable";

// REFACTOR:   Convert from JSON blobs to items when loading index?
// REFACTOR:   Delta index and announce when things are added/removed/moved
// REFACTOR:   Index to array of objects

export default class LoadableIndex extends Savable(Loadable()) {
  constructor(props) {
    super();
    Object.assign(this, props);
    dieIfMissing(this, "constructor", ["itemType", "createItem", "loadData"]);
  }

  // TODOC: creatItem, loadData

  //////////////////////////////
  //  Getting items
  //////////////////////////////

// DEPRECATED
  get firstChild() { return this.items && this.items[0] }
  get lastChild() { return this.items && this.items[this.items.length - 1]; }

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
  // If you call with the same `itemIdentifier` later, you'll get the same object back.
  // If we can't find the item in our index, the promise will reject.
  // NOTE: the promise resolves with the ITEM, not with the item's loaded data.
  loadItem(itemIdentifier, args) {
    // if we haven't loaded, load and call ourselves again
    if (!this.isLoaded) {
      return this.load()
        .then( () => this.loadItem(itemIdentifier, args) );
    }

    // get the item, rejecting if it couldn't be found.
    const item = this.getItem(itemIdentifier);
    if (!item) return Promise.reject(`${this.itemType} '${itemIdentifier}' not found`);

    // load and return the item as the result of its loading promise
    //  (no matter what the item's actual load returned).
    if (args === undefined) args = item.loadStyle;
    return item.load(args).then(result => item);
  }


  //////////////////////////////
  //  Manipulating
  //////////////////////////////

  // Change the id of some item `oldId` `newId`.
  // NOTE: does not change the INTERNAL id of the item... ????
  // Returns the item so changed.  Throws if item is not found.
  // Override in your subclass if there's more than one pointer to the object.
  changeId(oldId, newId) {
    if (!this.isLoaded) throw new TypeError(`${this}.changeId(${oldId}, ${newId}): index is not loaded`);

    const item = this.getItem(oldId);
    if (!item) throw new TypeError(`${this}.changeId(${oldId}): item not found`);

    delete this._registry[oldId];
    this._registry[newId] = item;

    return item;
  }

  //////////////////////////////
  //  Loading
  //////////////////////////////

  // Pass a `loadData` routine in on creation (or implement in a subclass).
  // Use `getIndexData()` to return the data to load.
  loadData() { throw new TypeError("You must implement or pass LoadableIndex.loadData()") }

  onLoaded(jsonItems = []) {
    if (typeof jsonItems === "string") jsonItems = JSON.parse(jsonItems);

    // Previous registry, so we'll re-use items
    const oldRegistry = this._registry || {};

    // `_registry` is a map of `{ id => item }`
    this._registry = {};

    // convert from jsonItems to actual items via injected `createItem()`
    this.items = jsonItems.map(jsonItem => {
      if (!jsonItem) return;
      const { id, ...props } = jsonItem;

// TODO: this won't update existing items with new properties from `props`...
      let item = oldRegistry[id] || this.createItem(id, props);
      this._registry[id] = item;
      return item;
    }).filter(Boolean);

    return this.items;
  }

  unload() {
    delete this.items;
    super.unload();
  }


  //////////////////////////////
  //  Saving
  //////////////////////////////

  // Pass a `saveData` routine in on creation (or implement in a subclass).
  // Use `getIndexData()` to return the data to save.
  saveData() { throw new TypeError("You must implement or pass LoadableIndex.saveData()") }

  // Return the data to save for the index.
  // NOTE: the default implementation assumes each item has a `getIndexData()` routine!
  getIndexData() {
    return this.items.map( item => item.getIndexData() );
  }


  //////////////////////////////
  //  Debugging
  //////////////////////////////

  toString() {
    return `[${this.itemType} LoadableIndex]`;
  }

}

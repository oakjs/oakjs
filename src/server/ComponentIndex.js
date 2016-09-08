//////////////////////////////
//  Simple server-side file for index of components.
//
//  All modifiers (add, remove, etc) will automaticaly `load()` as necessary.
//////////////////////////////

import paths from "./paths";

export default class ComponentIndex {
  constructor(props) {
    Object.assign(this, props);
    if (!this.items) this.items = [];
  }

  // Return the file contents of this index.
  // If `response` is passed, returns as a HTTP response.
  getFile(response) {
    return paths.getJSONFile(this.path, response);
  }

  load() {
    if (this.isLoaded) return Promise.resolve(this);

    if (!this.path) throw new TypeError("path not set for index");
    return this.getFile()
      // if file doesn't exist, return an empty array string for the next step
      .catch( () => { return "[]" })
      // then just remember the items
      .then( jsonText => {
        this.items = JSON.parse(jsonText);
        this.isLoaded = true;
        return this;
      })
  }

  save() {
    if (!this.path) throw new TypeError("path not set for index");
    return paths.saveJSON(this.path, this.items);
  }

  // Return an item by `id`.
  get(id) {
    const index = this.indexOfId(id);
    if (index > -1) return this.items[index];
  }

  // Given an `id`, return the index of that item in our `items`.
  // Returns `undefined` if we haven't yet loaded.
  indexOfId(id) {
    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index].id === id) return index;
    }
  }

  // Add an `item` to our `items` at `index`, pushing other thigns out of the way.
  // Defaults to the end of the list.
  // Returns the index where the item was added.
  //
  // If `save` is truthy, we'll save this file and return a promise with the index.
  add(item, index = this.items.length, save) {
    return this.load()
      .then( () => {
        this.items.splice(index, 0, item);
        if (save) return this.save().then( () => index );
        return index;
      });
  }

  // Remove the item at `index`.
  // Returns the item removed.
  //
  // If `save` is truthy, we'll auto-save this file and return a promise with the item removed.
  remove(index, save) {
    return this.load()
      .then( () => {
        const item = this.items.splice(index, 1)[0];
        if (save) return this.save().then( () => item );
        return result;
      });
  }

  // Remove an item specified by `id`.
  //
  // If `save` is truthy, we'll auto-save this file and return a promise with the item removed.
  removeById(id, save) {
    return this.load()
      .then( () => {
        const index = this.indexOfId(id);
        if (index === -1) return [];
        return this.remove(index, save);
      });
  }

  // Change the `id` and `title` of some item.
  //
  // If `save` is truthy, we'll auto-save this file.
  changeId(oldId, newId, newTitle, save) {
    return this.load()
      .then( () => {
        const item = this.get(oldId);
        if (item) {
          item.id = newId;
          if (newTitle !== undefined) item.title = newTitle;
        }
        if (save) return this.save();
      });
  }

}

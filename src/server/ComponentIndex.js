//////////////////////////////
// Simple server-side file for index of components.
//////////////////////////////

import paths from "./paths";

export default class ComponentIndex {
  constructor(props) {
    Object.assign(this, props);
    if (!this.items) this.items = [];
  }

  load() {
    if (!this.path) throw new TypeError("path not set for index");
    return paths.getTextFile(this.path)
      // if file doesn't exist, return an empty array string for the next step
      .catch( () => { return "[]" })
      // then just remember the items
      .then( jsonText => {
        this.items = JSON.parse(jsonText);
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
  // Returns `-1` if we haven't yet loaded.
  indexOfId(id) {
    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index].id === id) return index;
    }
  }

  // Add an `item` to our `items` at `index`, pushing other thigns out of the way.
  // Defaults to the end of the list.
  // Returns the index where the item was added.
  add(item, index = this.items.length) {
    this.items.splice(index, 0, item);
    return index;
  }

  // Remove the item at `index`.
  // Returns the item removed.
  remove(index) {
    return this.items.splice(index, 1)[0];
  }

  // Remove an item specified by `id`.
  removeById(id) {
    const index = this.indexOfId(id);
    if (index === -1) return [];
    return this.remove(index);
  }

  // Change the id of some item.
  changeId(oldId, newId) {
    const item = this.get(oldId);
    if (item) item.id = newId;
  }

}

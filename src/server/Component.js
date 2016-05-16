//////////////////////////////
//  Server-side Oak Component managment class
//  This lightweight implementation is geared toward simple file manipulation and servicing express responses.
//////////////////////////////

import { proto } from "../oak-roots/util/decorators";
import ids from "../oak-roots/util/ids";

import paths from "./paths";

// Set to `true` to debug creation and such.
const DEBUG = true;


// Use this to log an error and re-throw it
function logAndReThrowError(error) {
  console.error("ERROR: ", error);
  return Promise.reject(error);
}

export default class Component {

  constructor(...props) {
    Object.assign(this, ...props);
  }

  // Clone this object, giving it new props as desired.
  clone(props) {
    return new (this.constructor)(this, props);
  }

  //
  //  Syntactic sugar
  //

  // Dynamic pointer to our parent's index of children (which contains us).
  // Note that a new one is created each time you call this.
  get parentIndex() { return this.parent.childIndex }

  // Dynamic pointer to our child index, if we have one.
  // Note that a new one is created each time you call this.
  get childIndex() { throw new TypeError("You must implement get childIndex()") }


  //
  //  Server file paths
  //
  getFilePath(fileName = "") { throw new TypeError("You must implement getFilePath()") }

  // Filename for your jsxe file.  Use `@proto` to override!
  @proto
  jsxeFileName = "component.jsxe";

  // Filename for your styles file.  Use `@proto` to override!
  @proto
  stylesFileName = "component.css";

  // Filename for your script file.  Use `@proto` to override!
  @proto
  scriptFileName = "component.js";

  // Filename for your index file.  Use `@proto` to override!
  @proto
  childIndexFileName = undefined;

  getBundle(response, force) { throw new TypeError("You must implement getBundle()") }

  // Return default `jsxe` if none was specified when you were created.
  getDefaultJSXE(id, title) { throw new TypeError("You must implement getDefaultJSXE()") }

  // Create a blank child if we should do so when you are created.
  // If you do, save it and return its save promise.
  createBlankChild() {}


//
//  The following is generic
//

  get rootPath() { return this.getFilePath() }
  get jsxePath() { return this.getFilePath(this.jsxeFileName) }
  get stylesPath() { return this.getFilePath(this.stylesFileName) }
  get scriptPath() { return this.getFilePath(this.scriptFileName) }
  get childIndexPath() { return this.getFilePath(this.childIndexFileName) }
  get trashPath() { throw new TypeError("You must implement get trashPath()") }


  //
  //  Load / return the various bits.
  //  If you pass an express `response`, we'll write the contents to that.
  //  Otherwise we return a promise with the file contents as a text string.
  //

  getJSXE(response) { return paths.getTextFile(this.jsxePath, response) }
  getStyles(response) { return paths.getTextFile(this.stylesPath, response) }
  getScript(response) { return paths.getTextFile(this.scriptPath, response) }
  getChildIndex(response) { return paths.getJSONFile(this.childIndexPath, response) }

  // Special: get page bundle and it's our parent's index together in one object.
  getBundleAndParentIndex(response) {
    return Promise.all([ this.getBundle(), this.parent.getChildIndex() ])
          .then( ([ component, parentIndex ]) => {
            const bundle = { path: this.path, component, parentIndex };
            if (response) return response.send(bundle);
            return Promise.resolve( JSON.stringify(bundle) );
         })
         .catch(logAndReThrowError);
  }


  //
  //  CRUD.  All return a promise.
  //

  // Create a new component given a JSON blob and position within our parent.
  // Adds the component to the parent's childIndex.
  // `data` is the same as for `save()`.
  create({ data = {}, indexData = { id: this.id, title: this.id }, position } = {}) {
//TODO: uniqify id within parent!
    // Make sure we at least have a minimal JSXE file.
    if (!data.jsxe) {
      data.jsxe = this.getDefaultJSXE(indexData);
    }

    return this.save(data)
      // add to the parent's childIndex
      .then(() => {
        return this.parentIndex.add(indexData, position, "SAVE")
      })
      // create a blank child and save it
      .then(() => {
        const child = this.createBlankChild();
        if (child) return child.create();
      })
      .catch(logAndReThrowError);
  }

  // Duplicate this component.
  // Adds the component to the parent's childIndex.
  duplicate({ newId, indexData = { id: this.id, title: this.id }, position } = {}) {
//TODO: uniqify newId within parent!?!?!
    const clone = this.clone({ id: newId });

    return paths.copyFile(this.rootPath, clone.rootPath)
      // add to the parent's childIndex
      .then(() => {
        return this.parentIndex.add(indexData, position, "SAVE")
      })
      // return the clone
      .then(() => clone)
      .catch(logAndReThrowError);
  }

  //  Save this component given a JSON blob with any of:  `{ jsxe, styles, script, index }`
  //  Does NOT manipulate parent's index.
  //  NOTE: If you don't want to affect one of the above jsxe, etc, just don't include it.
  //        If you do include a value and it's blank/undefined, we'll delete that file.
  save(data) {
    return Promise.all([
      "jsxe" in data && paths.saveOrDeleteFile(this.jsxePath, data.jsxe),
      "styles" in data && paths.saveOrDeleteFile(this.stylesPath, data.styles),
      "script" in data && paths.saveOrDeleteFile(this.scriptPath, data.script),
      "index" in data && paths.saveOrDeleteFile(this.childIndexPath, data.index),
    ])
    .catch(logAndReThrowError);
  }

  //  Delete this component.
  //  Removes the component from the parent's childIndex.
  delete() {
// REFACTOR: save index data off so we can restore it later?
    // Remove from the component index first
    return this.parentIndex.removeById(this.id, "SAVE")
      // Remove the various files, `catch()`ing to ignoring errors (eg: if files are nor present)
      .then( () => paths.moveFile(this.rootPath, this.trashPath) )
      .catch(logAndReThrowError);
  }

  // UNdelete this component
  // Restores the component in the parent's childIndex
  undelete({ indexData, position } = {}) {
console.info("undelete", indexData, position);
    if (!indexData) throw new TypeError(`${this}.undelete(): you must provide indexData`);
    if (position == null) throw new TypeError(`${this}.undelete(): you must provide position`);
    // attempt to move FIRST, in case we can't find the trash folder
    return paths.moveFile(this.trashPath, this.rootPath)
      // then update the component index
      .then( () => this.parentIndex.add(indexData, position, "SAVE") )
      .catch(logAndReThrowError);
  }

  // Change the id of this component.
  // Updates parent's childIndex.
  // Returns a new component with the specified id.
  changeId(newId) {
//TODO: uniqify newId within parent!?!?!
    // Clone this item and update the id.
    const clone = this.clone({ id: newId });

    // move the folder first
    return paths.renameFile(this.rootPath, clone.rootPath)
      // then update the parent's childIndex
      .then(() => {
        return this.parentIndex.changeId(this.id, newId, "SAVE")
      })
      // return the clone
      .then(() => clone)
      .catch(logAndReThrowError);
  }

}

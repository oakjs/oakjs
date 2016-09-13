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
function logAndRejectError(error) {
  console.error("ERROR: ", error);
  return Promise.reject(error);
}

export default class Component {

  // Construct with one or more `props` objects.
  constructor(...props) {
    Object.assign(this, ...props);
  }

  // Clone this object, giving it new props as desired.
  clone(props) {
    return new (this.constructor)(this, props);
  }

  // Type of this component.  May be overridden when we're loaded from the index.
  // This will affect the `*FileName`s below.
  // Use @proto to override.
  @proto
  type = "Component";

  //
  //  Syntactic sugar
  //

  // Dynamic pointer to our parent's index of children (which contains us).
  // Note that a new one is created each time you call this.
  get parentIndex() { return this.parent.childIndex }

  // Dynamic pointer to our child index, if we have one.
  // Note that a new one is created each time you call this.
  get childIndex() { throw new TypeError("You must implement get childIndex()") }

  // Return index data for this component in our parent's index.
  getIndexData(id = this.id, title = this.title || id) {
    return { type: this.type, id, title }
  }

  //
  //  Server file paths
  //  Define getters to override paths!
  //
  getFilePath(fileName = "") { throw new TypeError("You must implement getFilePath()") }

  // Filename for your jsxe file.
  get jsxeFileName() { return `${this.type}.jsxe`; }

  // Filename for your styles file.
  get stylesFileName() { return `${this.type}.css`; }

  // Filename for your script file.
  get scriptFileName() { return `${this.type}.js`; }

  // Filename for your index file.
  get childIndexFileName() { return `index.json`; }


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
    return Promise.all([ this.getBundle(), this.parentIndex.getFile() ])
          .then( ([ component, parentIndex ]) => {
            const bundle = { path: this.path, component, parentIndex };
            if (response) return response.send(bundle);
            return Promise.resolve( JSON.stringify(bundle) );
         })
         .catch(logAndRejectError);
  }


  //
  //  CRUD.  All return a promise.
  //

  // Create a new component given a JSON blob and position within our parent.
  // Adds the component to the parent's childIndex.
  // `data` is the same as for `save()`.
  create({ data = {}, indexData = this.getIndexData(), position } = {}) {
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
if (child) console.info(child.getIndexData());
        if (child) return child.create();
      })
      .catch(logAndRejectError);
  }

  // Duplicate this component.
  // Adds the component to the parent's childIndex.
  duplicate({ newId, indexData = this.getIndexData(), position } = {}) {
//TODO: uniqify newId within parent!?!?!
    const clone = this.clone({ id: newId });

    return paths.copyFile(this.rootPath, clone.rootPath)
      // add to the parent's childIndex
      .then(() => {
        return this.parentIndex.add(indexData, position, "SAVE")
      })
      // return the clone
      .then(() => clone)
      .catch(logAndRejectError);
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
    .catch(logAndRejectError);
  }

  //  Delete this component.
  //  Removes the component from the parent's childIndex.
  delete() {
// REFACTOR: save index data off so we can restore it later?
    // Remove from the component index first
    return this.parentIndex.removeById(this.id, "SAVE")
      // Remove the various files, `catch()`ing to ignoring errors (eg: if files are nor present)
      .then( () => paths.moveFile(this.rootPath, this.trashPath) )
      .catch(logAndRejectError);
  }

  // UNdelete this component
  // Restores the component in the parent's childIndex
  undelete({ indexData, position } = {}) {
    if (!indexData) throw new TypeError(`${this}.undelete(): you must provide indexData`);
    if (position == null) throw new TypeError(`${this}.undelete(): you must provide position`);
    // attempt to move FIRST, in case we can't find the trash folder
    return paths.moveFile(this.trashPath, this.rootPath)
      // then update the component index
      .then( () => this.parentIndex.add(indexData, position, "SAVE") )
      .catch(logAndRejectError);
  }

  // Change the id of this component.
  // Updates parent's childIndex.
  // Returns a new component with the specified id.
  changeId({ newId, indexData }) {
//TODO: uniqify newId within parent!?!?!
    // Clone this item and update the id.
    const clone = this.clone(indexData);

    // move the folder first
    return paths.renameFile(this.rootPath, clone.rootPath)
      // then update the parent's childIndex
      .then(() => {
        return this.parentIndex.changeId(this.id, newId, indexData, "SAVE")
      })
      // return the clone
      .then(() => clone)
      .catch(logAndRejectError);
  }

}

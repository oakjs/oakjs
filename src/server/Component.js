//////////////////////////////
//  Server-side Oak Component managment class
//  This lightweight implementation is geared toward simple file manipulation and servicing express responses.
//////////////////////////////

import { proto } from "../oak-roots/util/decorators";

import paths from "./paths";

// Set to `true` to debug creation and such.
const DEBUG = true;

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
  // If you do, save it and returns its save promise.
  createBlankChild() {}


//
//  The following is generic
//

  get rootPath() { return this.getFilePath() }
  get jsxePath() { return this.getFilePath(this.jsxeFileName) }
  get stylesPath() { return this.getFilePath(this.stylesFileName) }
  get scriptPath() { return this.getFilePath(this.scriptFileName) }
  get childIndexPath() { return this.getFilePath(this.childIndexFileName) }


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
          .then( ([ item, index ]) => {
            const bundle = { item, index };
            if (response) return response.send(bundle);
            return Promise.resolve( JSON.stringify(bundle) );
         });
  }


  //
  //  CRUD.  All return a promise.
  //

  // Create a new component given a JSON blob and position within our parent.
  // Adds the component from the parent's childIndex.
  // `data` is the same as for `save()`.
  create({ data = {}, title = this.id, position } = {}) {
    // Make sure we at least have a minimal JSXE file.
    if (!data.jsxe) {
      data.jsxe = this.getDefaultJSXE(this.id, title);
    }

    return this.save(data)
      // add to the parent's childIndex
      .then(() => {
        const indexData = { id: this.id, title };
console.info("saved", indexData);
        return this.parentIndex.add(indexData, position, "SAVE")
      })
      // create a blank child and save it
      .then(() => {
console.info("index updated");
        const child = this.createBlankChild();
        if (child) return child.create();
      })
      .then(() => {
console.info("finished creating");
      })
      .catch( error => console.warn(error) )
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
      .catch( error => console.warn(error) )
  }

  //  Delete this component.
  //  Removes the component from the parent's childIndex.
  delete() {
    // Remove from the component index first
    return this.parentIndex.removeById(this.id, "SAVE")
      .then(() => {
        // Remove the various files, `catch()`ing to ignoring errors (eg: if files are nor present)
        return Promise.all([
            paths.deleteFile(this.jsxePath).catch(Function.prototype),
            paths.deleteFile(this.stylesPath).catch(Function.prototype),
            paths.deleteFile(this.scriptPath).catch(Function.prototype),
            paths.deleteFile(this.childIndexPath).catch(Function.prototype)
          ]);
        })
      .catch( error => console.warn(error) )
  }

  // Change the id of this component.
  // Updates parent's childIndex.
  // Returns a new component with the specified id.
  changeId(newId) {
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
      .catch( error => console.warn(error) )
  }

}

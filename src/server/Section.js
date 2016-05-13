//////////////////////////////
// Server-side Oak Section managment class
// NOTE: instantiating a project is really lightweight
//       so you can do so dynamically when servicing requests.
//////////////////////////////


import bundler from "./bundler";
import ComponentIndex from "./ComponentIndex";
import paths from "./paths";

export default class Section {

  // Construction will fail if you pass improper ids for `projectId`, `sectionId`
  constructor(projectId, sectionId, props) {
    this.projectId = paths.dieIfInvalidId(projectId);
    this.sectionId = paths.dieIfInvalidId(sectionId);
    if (props) Object.assign(this, props);
  }

  //
  //  Syntactic sugar
  //
  get path() {
    return `${this.projectId}/${this.sectionId}/${this.pageId}`;
  }

  get project() {
    return new Project(this.projectId);
  }


  //
  //  Server file paths
  //

  get rootPath() { return paths.sectionPath(this.projectId, this.sectionId) }
  get jsxePath() { return paths.sectionPath(this.projectId, this.sectionId, "section.jsxe") }
  get stylesPath() { return paths.sectionPath(this.projectId, this.sectionId, "section.css") }
  get scriptPath() { return paths.sectionPath(this.projectId, this.sectionId, "section.js") }
  get indexPath() { return paths.sectionPath(this.projectId, this.sectionId, "pages.json") }
  get bundlePath() { return paths.bundlePath("projects", this.projectId, `${this.sectionId}.bundle.json`) }


  //
  //  Load / return the various bits.
  //  If you pass an express `response`, we'll write the contents to that.
  //  Otherwise we return a promise with the file contents.
  //

  getBundle(response, force) { return bundler.bundleSection({ section: this, response, force }) }
  getJSXE(response) { return paths.getTextFile(this.jsxePath, response) }
  getStyles(response) { return paths.getTextFile(this.stylesPath, response) }
  getScript(response) { return paths.getTextFile(this.scriptPath, response) }
  getIndex(response) { return paths.getJSONFile(this.indexPath, response) }


  //
  //  CRUD.  All return a promise.
  //

  // Create a page given a JSON blob and page index (defaults to the end of the section).
  //  `json` is the same as for `save()`.
  create(json, index) {
    this.save(json)
      .then(this.project.addSection(this, index));
  }

  //  Save a page given a JSON blob with any of:  `{ jsxe, styles, script }`
  //  Does NOT manipulate project sectionIndex.
  //  NOTE: If you don't want to affect one of the above jsxe, etc, just don't include it.
  //        If you do include a value and it's blank/undefined, we'll delete that file.
  save(json) {
    return Promise.all([
      "jsxe" in data && paths.saveOrDeleteFile(this.jsxePath, data.jsxe),
      "styles" in data && paths.saveOrDeleteFile(this.stylesPath, data.styles),
      "script" in data && paths.saveOrDeleteFile(this.scriptPath, data.script),
      "index" in data && paths.saveOrDeleteFile(this.indexPath, data.index),
    ]);
  }

  //  Delete this page.
  //  Removes the page from the project's sectionIndex.
  delete() {
    // Remove from the page index first
    return this.project.removeSection(this)
      .then(() => {
        // Remove the various files, `catch()`ing to ignoring errors (eg: if files are nor present)
        return Promise.all([
            paths.deleteFile(this.jsxePath).catch(Function.prototype),
            paths.deleteFile(this.stylesPath).catch(Function.prototype),
            paths.deleteFile(this.scriptPath).catch(Function.prototype),
            paths.deleteFile(this.indexPath).catch(Function.prototype)
          ]);
        });
  }

  //  Change the id of this section.
  //  Updates projects's sectionIndex.
  changeId(newSectionId) {
    // get a new Section object with newSectionId to figure out it's path
    const newSection = new Section(this.projectId, this.sectionId, newSectionId);
    const newSectionRoot = newSection.rootPath;

    // move the folder first
    return paths.renameFile(this.rootPath, newSection.rootPath)
      // then update the project's sectionIndex
      .then(() => {
        return this.project.changeSectionId(this.sectionId, newSectionId)
      })
      // then rename this object
      .then(() => {
        this.sectionId = newSectionId;
      })
  }


  //
  //  Page index manipulation
  //

  get pageIndex() {
    return this._pageIndex
      || (this._pageIndex = new ComponentIndex({path: this.indexPath}));
  }

  // Add a page at the specified index, defaulting to the end.
  // Auto-saves the index.
  // Returns a promise which yields the actual `index` value added.
  addPage(page, index) {
    let addedAtIndex;
    return this.pageIndex.load()
      .then( () => {
        addedAtIndex = this.pageIndex.add(page, index);
        return this.pageIndex.save()
      })
      .then( () => addedAtIndex );
  }

  // Remove page specified by id and save the index.
  // Yields a promise which resolves when the pageIndex is saved.
  removePage(pageId) {
    return this.pageIndex.load()
      .then( () => {
        this.pageIndex.removeById(pageId);
        return this.pageIndex.save();
      });
  }

  // Rename the page in our section index and save it.
  // Yields a promise which resolves when the pageIndex is saved.
  // NOTE: does NOT do anything with the Page, see `Page.changeId()`.
  changePageId(oldPageId, newPageId) {
    return this.pageIndex.load()
      .then( () => {
        this.pageIndex.changeId(oldPageId, newPageId);
        return this.pageIndex.save();
      })
  }


}

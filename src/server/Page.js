//////////////////////////////
// Server-side Oak Page managment class
// NOTE: instantiating a project is really lightweight
//       so you can do so dynamically when servicing requests.
//////////////////////////////


import fsp from "fs-promise";
import paths from "./paths";

export default class Page {

  // Construction will fail if you pass improper ids for `projectId`, `sectionId` or `pageId`.
  constructor(projectId, sectionId, pageId, props) {
    this.projectId = paths.dieIfInvalidId(projectId);
    this.sectionId = paths.dieIfInvalidId(sectionId);
    this.pageId = paths.dieIfInvalidId(pageId);
    if (props) Object.assign(this, props);
  }

  //
  //  Get Project and Section objects for this page
  //
  get project() {
    return new Project(this.projectId);
  }

  get section() {
    return new Section(this.projectId, this.sectionId);
  }

  //
  //  Server file paths
  //

  get rootPath() { return paths.pagePath(this.projectId, this.sectionId, this.pageId) }
  get jsxePath() { return paths.pagePath(this.projectId, this.sectionId, this.pageId, "page.jsxe") }
  get stylesPath() { return paths.pagePath(this.projectId, this.sectionId, this.pageId, "page.css") }
  get scriptPath() { return paths.pagePath(this.projectId, this.sectionId, this.pageId, "page.js") }
  get bundlePath() { return paths.bundlePath("projects", this.projectId, this.sectionId, `${this.pageId}.bundle.json`) }


  //
  //  Load/Save/Delete the various bits.  All return a promise.
  //  Conside using the higher-level `save`, `delete`, etc routines instead.
  //

  getJSXE() { return fsp.readFile(this.jsxePath, "utf8") }
  getStyles() { return fsp.readFile(this.stylesPath, "utf8") }
  getScript() { return fsp.readFile(this.scriptPath, "utf8") }

  _saveFile(path, contents) {
    // If there's anything to save, do so
    if (contents) return fsp.outputFile(path, contents);
    // Otherwise unlink file file, ignoring errors (eg: if the file isn't present)
    return fsp.unlink(path).catch(Function.prototype);
  }
  saveJSXE(contents) { return this._saveFile(this.jsxePath, contents) }
  saveStyles(contents) { return this._saveFile(this.stylesPath, contents) }
  saveScript(contents) { return this._saveFile(this.scriptPath, contents) }

  deleteJSXE() { return fsp.unlink(this.jsxePath) }
  deleteStyles() { return fsp.unlink(this.stylesPath) }
  deleteScript() { return fsp.unlink(this.scriptPath) }


  //
  //  CRUD.  All return a promise.
  //

  // Bundle up the page contents as a JSON blob and have the response return it.
  bundle(response, { force } = {}) {
    return bundler.bundlePage({ this, response, force });
  }

  // Create a page given a JSON blob and page index (defaults to the end of the section).
  //  `json` is the same as for `save()`.
  create(json, index) {
    this.save(json)
      .then(this.section.addPage(this, index));
  }

  //  Save a page given a JSON blob with any of:  `{ jsxe, styles, script }`
  //  Does NOT manipulate section pageIndex.
  save(json) {
console.warn("saving", json);
    const promises = [];
    if ("jsxe" in json) promises.push(this.saveJSXE(json.jsxe));
    if ("styles" in json) promises.push(this.saveStyles(json.styles));
    if ("script" in json) promises.push(this.saveScript(json.script));
    return Promise.all(promises);
  }

  //  Delete this page.
  //  Removes the page from the section's pageIndex.
  delete() {
    // Remove from the page index first
    return this.section.removePage(this)
      .then(() => {
        // Remove the various files, `catch()`ing to ignoring errors (eg: if files are nor present)
        return Promise.all([
            this.removeJSXE().catch(Function.prototype),
            this.removeStyles().catch(Function.prototype),
            this.removeScript().catch(Function.prototype)
          ]);
        });
  }

  //  Rename this page.
  //  Updates section's pageIndex.
  rename(newPageId) {
    const newPage = new Page(this.projectId, this.sectionId, newPageId);
    const newPageRoot = newPage.rootPath;

    // move the folder first
    return fsp.rename(this.rootPath, newPage.rootPath)
      // then update the section's pageIndex
      .then(() => {
        this.section.renamePage(this.pageId, newPageId)
      })
      // then rename this object
      .then(() => {
        this.pageId = newPageId;
      })
  }

}

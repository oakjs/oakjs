//////////////////////////////
// Server-side Oak Page managment class
// NOTE: instantiating a project is really lightweight
//       so you can do so dynamically when servicing requests.
//////////////////////////////


import paths from "./paths";
import Section from "./Section";

export default class Page {

  // Construction will fail if you pass improper ids for `projectId`, `sectionId` or `pageId`.
  constructor(projectId, sectionId, pageId, props) {
    this.projectId = paths.dieIfInvalidId(projectId);
    this.sectionId = paths.dieIfInvalidId(sectionId);
    this.pageId = paths.dieIfInvalidId(pageId);
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
  getJSXE() { return paths.getTextFile(this.jsxePath) }
  getStyles() { return paths.getTextFile(this.stylesPath) }
  getScript() { return paths.getTextFile(this.scriptPath) }

  saveJSXE(contents) { return paths.saveOrDeleteFile(this.jsxePath, contents)}
  saveStyles(contents) { return paths.saveOrDeleteFile(this.stylesPath, contents)}
  saveScript(contents) { return paths.saveOrDeleteFile(this.scriptPath, contents)}

  // Ignore errors on delete (eg: if the file is not present)
  deleteJSXE() { return paths.deleteFile(this.jsxePath)}
  deleteStyles() { return paths.deleteFile(this.stylesPath)}
  deleteScript() { return paths.deleteFile(this.scriptPath)}


  //
  //  CRUD.  All return a promise.
  //

  // Bundle up the page contents as a JSON blob and have the response return it.
  bundle(response, { force } = {}) {
    return bundler.bundlePage({ this, response, force });
  }

  // Create a page given a JSON blob and page index (defaults to the end of the section).
  //  `json` is the same as for `save()`.
  // Returns a promise which yields with the index of the new page.
  create(json, index) {
    this.save(json)
      .then(this.section.addPage(this, index));
  }

  //  Save a page given a JSON blob with any of:  `{ jsxe, styles, script }`
  //  Does NOT manipulate section pageIndex.
  //  NOTE: If you don't want to affect one of the above jsxe, etc, just don't include it.
  //        If you do include a value and it's blank/undefined, we'll delete that file.
  save(json) {
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

  //  Change the id of this page.
  //  Updates section's pageIndex.
  changeId(newPageId) {
    // get a new Page object with newPageId to figure out it's path
    const newPage = new Page(this.projectId, this.sectionId, newPageId);
    const newPageRoot = newPage.rootPath;

    const section = this.section;
    // move the folder first
    return paths.renameFile(this.rootPath, newPage.rootPath)
      // then update the section's pageIndex
      .then(() => {
        return section.changePageId(this.pageId, newPageId)
      })
      // then rename this object
      .then(() => {
        this.pageId = newPageId;
      })
  }

}

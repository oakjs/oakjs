//////////////////////////////
// Server-side Oak Page managment class
// NOTE: instantiating a project is really lightweight
//       so you can do so dynamically when servicing requests.
//////////////////////////////


import paths from "./paths";
import Section from "./Section";

export default class Page {

  // Construction will fail if you pass improper ids for `projectId`, `sectionId` or `pageId`.
  // NOTE: does not verify that the page exists!
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
  //  CRUD.  All return a promise.
  //

  // Bundle up the page contents as a JSON blob and have the response return it.
  bundle(response, { force } = {}) {
    return bundler.bundlePage({ this, response, force });
  }

  // Create a page given a JSON blob and page index (defaults to the end of the section).
  //  `data` is the same as for `save()`.
  // Returns a promise which yields with the index of the new page.
  create({ data = {}, title = "Untitled Page", position }) {
    // Make sure we at least have a minimal JSXE file.
    if (!data.jsxe) {
      data.jsxe = `<OakPage id="${this.pageId}" title="${title}"/>`;
    }

    return this.save(data)
      .then(() => {
        const indexData = { id: this.pageId, title };
        return this.section.addPage(indexData, position)
      });
  }

  //  Save a page given a JSON blob with any of:  `{ jsxe, styles, script }`
  //  Does NOT manipulate section pageIndex.
  //  NOTE: If you don't want to affect one of the above jsxe, etc, just don't include it.
  //        If you do include a value and it's blank/undefined, we'll delete that file.
  save(data) {
    return Promise.all([
      "jsxe" in data && paths.saveOrDeleteFile(this.jsxePath, data.jsxe),
      "styles" in data && paths.saveOrDeleteFile(this.stylesPath, data.styles),
      "script" in data && paths.saveOrDeleteFile(this.scriptPath, data.script),
    ])
  }

  //  Delete this page.
  //  Removes the page from the section's pageIndex.
  delete() {
    // Remove from the page index first
    return this.section.removePage(this.pageId)
      .then(() => {
        // Remove the various files, `catch()`ing to ignoring errors (eg: if files are nor present)
        return Promise.all([
            paths.deleteFile(this.jsxePath).catch(Function.prototype),
            paths.deleteFile(this.stylesPath).catch(Function.prototype),
            paths.deleteFile(this.scriptPath).catch(Function.prototype)
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

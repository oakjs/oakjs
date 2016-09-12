//////////////////////////////
//  Server-side Oak Page managment class
//  This lightweight implementation is geared toward simple file manipulation and servicing express responses.
//////////////////////////////

import { proto } from "../oak-roots/util/decorators";
import ids from "../oak-roots/util/ids";

import bundler from "./bundler";
import paths from "./paths";
import Component from "./Component";
import Project from "./Project";
import Section from "./Section";

export default class Page extends Component {

  // Construction will fail if you pass improper ids for `projectId`, `sectionId` or `pageId`.
  // NOTE: does not verify that the page exists!
  constructor(...props) {
    super(...props);
    paths.dieIfInvalidId(this.projectId, "projectId");
    paths.dieIfInvalidId(this.sectionId, "sectionId");
    paths.dieIfInvalidId(this.pageId, "pageId");
  }

  @proto
  type = "Page";

  get id() { return this.pageId }
  set id(id) { this.pageId = id }

  get path() { return `${this.projectId}/${this.sectionId}/${this.pageId}` }

  getFilePath(fileName = "") {
    return paths.pagePath(this.projectId, this.sectionId, this.pageId, fileName);
  }
  get bundlePath() { return paths.bundlePath("projects", this.projectId, this.sectionId, `${this.pageId}.bundle.json`) }
  get trashPath() { return paths.trashPath(this.projectId, this.sectionId, this.pageId) }

  get parent() { return new Section({ projectId: this.projectId, sectionId: this.sectionId }) }
  get section() { return this.parent }
  get project() { return this.parent.parent }

  getBundle(response, force) {
    return bundler.bundlePage({ page: this, response, force })
  }

  getDefaultJSXE({ id, title }) {
    return `<Oak.Page id="${id}" title="${title}" oid="${ids.generateRandomId()}"></Oak.Page>`;
  }
}

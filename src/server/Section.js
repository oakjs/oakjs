//////////////////////////////
//  Server-side Oak Section managment class
//  This lightweight implementation is geared toward simple file manipulation and servicing express responses.
//////////////////////////////

import { proto } from "../oak-roots/util/decorators";

import bundler from "./bundler";
import Component from "./Component";
import ComponentIndex from "./ComponentIndex";
import paths from "./paths";
import Page from "./Page";
import Project from "./Project";

export default class Section extends Component {

  // Construction will fail if you pass improper ids for `projectId`, `sectionId`
  // NOTE: does not verify that the section exists!
  constructor(...props) {
    super(...props);
    paths.dieIfInvalidId(this.projectId, "projectId");
    paths.dieIfInvalidId(this.sectionId, "sectionId");
  }

  get id() { return this.sectionId }
  set id(id) { this.sectionId = id }

  get path() { return `${this.projectId}/${this.sectionId}` }

  getFilePath(fileName = "") {
    return paths.sectionPath(this.projectId, this.sectionId, fileName);
  }
  get bundlePath() { return paths.bundlePath("projects", this.projectId, `${this.sectionId}.bundle.json`) }
  get trashPath() { return paths.trashPath(this.projectId, this.sectionId) }

  get parent() { return new Project({ projectId: this.projectId }) }
  get project() { return this.parent }

  get childIndex() { return new ComponentIndex({ path: this.childIndexPath }) }

  @proto
  jsxeFileName = "section.jsxe";

  @proto
  stylesFileName = "section.css";

  @proto
  scriptFileName = "section.js";

  @proto
  childIndexFileName = "pages.json";

  getBundle(response, force) {
    return bundler.bundleSection({ section: this, response, force })
  }

  getDefaultJSXE({ id, title }) {
    return `<Oak-Section id="${id}" title="${title}"><Oak-CurrentPage/></Oak-Section>`;
  }

  createBlankChild() {
    return new Page({ projectId: this.projectId, sectionId: this.sectionId, pageId: "Untitled" });
  }

}

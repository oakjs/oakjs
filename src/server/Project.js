//////////////////////////////
//  Server-side Oak Project managment class
//  This lightweight implementation is geared toward simple file manipulation and servicing express responses.
//////////////////////////////

import { proto } from "../oak-roots/util/decorators";

import bundler from "./bundler";
import Component from "./Component";
import ComponentIndex from "./ComponentIndex";
import paths from "./paths";
import Section from "./Section";

export default class Project extends Component {

  // Construction will fail if you pass improper ids for `projectId`
  // NOTE: does not verify that the section exists!
  constructor(...props) {
    super(...props);
    paths.dieIfInvalidId(this.projectId, "projectId");
  }

  get id() { return this.projectId }
  set id(id) { this.projectId = id }

  get path() { return `${this.projectId}` }

  getFilePath(fileName = "") {
    return paths.projectPath(this.projectId, fileName);
  }
  get bundlePath() { return paths.bundlePath("projects", `${this.projectId}.bundle.json`) }

  get parentIndex() { return new ComponentIndex({ path: paths.projectIndexPath }) }
  get childIndex() { return new ComponentIndex({ path: this.childIndexPath }) }

  @proto
  jsxeFileName = "project.jsxe";

  @proto
  stylesFileName = "project.css";

  @proto
  scriptFileName = "project.js";

  @proto
  childIndexFileName = "sections.json";

  getBundle(response, force) {
    return bundler.bundleProject({ project: this, response, force })
  }

  getDefaultJSXE(id, title) {
    return `<OakProject id="${id}" title="${title}"><CurrentSection/></OakProject>`;
  }

  createBlankChild() {
    return new Section(this.projectId, "main");
  }

}

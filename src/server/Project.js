//////////////////////////////
//  Server-side Oak Project managment class
//  This lightweight implementation is geared toward simple file manipulation and servicing express responses.
//////////////////////////////

import { proto } from "../oak-roots/util/decorators";
import ids from "../oak-roots/util/ids";

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

  @proto
  type = "Project";

  get id() { return this.projectId }
  set id(id) { this.projectId = id }

  get path() { return `${this.projectId}` }

  getFilePath(fileName = "") {
    return paths.projectPath(this.projectId, fileName);
  }
  get parentIndex() { return new ComponentIndex({ path: paths.projectIndexPath }) }
  get childIndex() { return new ComponentIndex({ path: this.childIndexPath }) }

  getBundle(response, force) {
    return bundler.bundleProject({ project: this, response, force })
  }

  getDefaultJSXE({ id, title }) {
    return `<Oak.Project id="${id}" title="${title}" oid="${ids.generateRandomId()}">\n\t<Oak.CurrentSection/>\n</Oak.Project>`;
  }

  createBlankChild() {
    return new Section({ projectId: this.projectId, sectionId: "main" });
  }

}

//////////////////////////////
//  Server-side Oak ProjectComponent managment class
//  This lightweight implementation is geared toward simple file manipulation and servicing express responses.
//////////////////////////////

import { proto } from "../oak-roots/util/decorators";
import ids from "../oak-roots/util/ids";

import bundler from "./bundler";
import Component from "./Component";
import ComponentIndex from "./ComponentIndex";
import paths from "./paths";
import Project from "./Project";

export default class ProjectComponent extends Component {

  // Construction will fail if you pass improper ids for `projectId`, `sectionId`
  // NOTE: does not verify that the section exists!
  constructor(...props) {
    super(...props);
    paths.dieIfInvalidId(this.projectId, "projectId");
    paths.dieIfInvalidId(this.componentId, "componentId");
  }

  get id() { return this.componentId }
  set id(id) { this.componentId = id }

  get path() { return `${this.projectId}/${this.componentId}` }

  getFilePath(fileName = "") {
    return paths.projectComponentPath(this.projectId, this.componentId, fileName);
  }

  get parent() { return new Project({ projectId: this.projectId }) }
  get project() { return this.parent }

  getBundle(response, force) {
    return bundler.bundleComponent({ component: this, response, force })
  }

  getDefaultJSXE({ id, title }) {
    return `<div/>`;
  }

}

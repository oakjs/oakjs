//////////////////////////////
// ProjectController class
//////////////////////////////

import decorators from "oak-roots/util/decorators";
import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentController from "./ComponentController";
import Project from "./Project";


export default class ProjectController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["projectId"]);
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////

  @decorators.proto
  static type = "project";

  @decorators.proto
  static baseComponentConstructor = Project;

  get id() { return `${this.projectId}` }
  get path() { return `${this.projectId}` }

  get selector() { return `.oak.Project#${this.projectId}` }
  get projectId() { return this.attributes && this.attributes.project }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
      childIndex: api.loadControllerChildIndex(this),
      component: api.loadControllerJSXE(this),
      styles: api.loadControllerStyles(this),
      script: api.loadControllerScript(this)
    });
  }

  saveData() {
    super.saveData();
    return Promise.all([this.saveChildIndex(), this.saveComponent(), this.saveStyle(), this.saveScript()]);
  }

}

export default ProjectController;


//////////////////////////////
// ProjectElement class
//////////////////////////////
import JSXElement from "./JSXElement";

// Create a specialized `ProjectElement` and export it
export class ProjectElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    project: "context.project",
    components: "context.components",
    data: "project.data"
  }
}

// Register it so `<Project>` elements in a jsxe will use `ProjectElement`.
JSXElement.registerType("Project", ProjectElement);

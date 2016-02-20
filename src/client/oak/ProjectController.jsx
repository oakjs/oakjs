//////////////////////////////
// ProjectController class
//////////////////////////////

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

  static type = "project";
  static baseComponentConstructor = Project;

  get id() { return `${this.projectId}` }
  get path() { return `${this.projectId}` }

  get selector() { return `.oak.Project#${this.projectId}` }
  get projectId() { return this.props && this.props.project }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
      index: api.loadControllerIndex(this),
      component: api.loadControllerJSXE(this),
      styles: api.loadControllerStyles(this),
      script: api.loadControllerScript(this)
    });
  }

  saveData() {
    return api.map({
      index: api.saveControllerIndex(this),
      component: api.saveControllerJSXE(this),
      styles: api.saveControllerStyles(this),
      script: api.saveControllerScript(this)
    });
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

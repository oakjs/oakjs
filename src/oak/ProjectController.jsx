//////////////////////////////
// ProjectController class
//////////////////////////////

import OakController from "./OakController";
import Project from "./Project";

export default class ProjectController extends OakController {

  //////////////////////////////
  //  Identity
  //////////////////////////////

  get type() { return "project" }
  get baseComponentConstructor() { return Project }

  get id() { return `${this.projectId}` }
  get path() { return `${this.projectId}` }

// TODO: this.parent.rootSelector + ...
  get rootSelector() { return `.oak.Project#${this.projectId}` }

  get projectId() { return this.attributes && this.attributes.project }

  dieIfNotIdentified(errorMessage) {
    this.dieIfMissing(["projectId"], errorMessage);
  }


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    super.loadData();
    return Promise.all([this.loadChildIndex(), this.loadComponent(), this.loadStyle(), this.loadScript()])
      .then(([childIndex, component, style, script]) => {
        return { childIndex, component, style, script }
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

//////////////////////////////
// ProjectController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentController from "./ComponentController";
import OakProject from "./Project";


export default class ProjectController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["projectId"]);
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////

  static type = "project";

  get id() { return this.projectId }
  get projectId() { return this.props && this.props.project }

  get path() { return `${this.projectId}` }
  get selector() { return `.oak.Project#${this.projectId}` }

  // IFF we've loaded, return the stack id for a stack specified by index or id.
  // If we haven't loaded or we don't know about the stack, returns `undefined`.
  getStackId(stackIdentifier) {
    if (this.index) {
      if (typeof stackIdentifier === "string") {
        return this.index[stackIdentifier] && stackIdentifier;
      }
      else if (typeof stackIdentifier === "number") {
        return Object.keys(this.index)[stackIdentifier];
      }
      else {
        console.error(`${this}.getStackId(${stackIdentifier}): don't understand identifier`);
      }
    }
    return undefined;
  }

  _createComponentConstructor() {
    return class Project extends OakProject {};
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
      index: api.loadControllerIndex(this),
      component: api.loadControllerJSXE(this),
      styles: api.loadControllerStyles(this),
      script: api.loadControllerScript(this)
    })
    .then(results => {
      this.mutate(results);
      return this;
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

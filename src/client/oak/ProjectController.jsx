//////////////////////////////
// ProjectController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentController from "./ComponentController";
import OakProject from "./Project";
import StackIndex from "./StackIndex";

import { classNames } from "oak-roots/util/react";


export default class ProjectController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app", "projectId"]);

    // create our stack index
    this.stacks = new StackIndex({ app: this.app, project: this, path: this.path });
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////

  static type = "project";

  get id() { return this.projectId }
  get projectId() { return this.props && this.props.project }

  get path() { return this.projectId }
  get selector() { return `.oak.Project#${this.id}` }

  _createComponentConstructor() {
    return class Project extends OakProject {};
  }

  //////////////////////////////
  //  Stacks
  //////////////////////////////

  get stackIds() { return this.stacks.ids }

  getStack(stackIdentifier) {
    return this.stacks.get(stackIdentifier);
  }

  loadStack(stackIdentifier) {
    return this.stacks.loadComponent(stackIdentifier);
  }


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return Promise.all([
        this.stacks.load(),
        api.loadControllerJSXE(this),
        api.loadControllerStyles(this),
        api.loadControllerScript(this)
      ])
      .then(([ stacks, component, styles, script ]) => {
        this.mutate({ component, styles, script });
        return this;
      });
  }

  saveData() {
    return Promise.all([
        this.stacks.save(),
        api.saveControllerJSXE(this),
        api.saveControllerStyles(this),
        api.saveControllerScript(this)
      ])
      .then( () => { this } );
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
    app: "context.app",
    project: "context.project",
    components: "context.components",
    data: "project.data"
  }

  // Render out outer element as a div with only a few properties
  renderType = "div";
  _attributesToSource(options, indent) {
    const { id, className, style } = this.attributes;
    return super._attributesToSource(options, indent, {
      id,
      className: classNames("oak Project", className),
      style
    });
  }
}

// Register it so `<Project>` elements in a jsxe will use `ProjectElement`.
JSXElement.registerType("Project", ProjectElement);

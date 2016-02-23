//////////////////////////////
// ProjectController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentController from "./ComponentController";
import ComponentIndex from "./ComponentIndex";
import ProjectComponent from "./ProjectComponent";
import StackController from "./StackController";



export default class ProjectController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app", "projectId"]);

    // create our stack index
    this.stacks = new ComponentIndex({ controller: this, type: "project" });
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////

  static type = "project";

  get id() { return this.projectId }
  get projectId() { return this.props && this.props.project }

  get path() { return this.projectId }
  get selector() { return `.oak.Project#${this.id}` }

  _createComponentConstructor(renderMethod) {
    return class _ProjectComponent extends ProjectComponent {
      static id = this.id;
      static controller = this;
      static app = this.app;

      static renderMethod = renderMethod;
      render() {
        return this.constructor.renderMethod.apply(this);
      }
    };
  }

  // TODO: dynamic components
  get components() { return this.app.components }

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

  _makeComponent(index, stackId, props) {
    return new StackController({
      app: this.app,
      project: this,
      props: {
        project: this.id,
        stack: stackId,
        ...props
      }
    });
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
import { classNames } from "oak-roots/util/react";

// Create a specialized `ProjectElement` and export it
export class ProjectElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    app: "context.app",
    project: "context.project",
    components: "context.components",
//    data: "project.data"
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

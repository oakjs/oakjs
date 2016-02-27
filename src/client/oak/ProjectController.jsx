//////////////////////////////
// ProjectController class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import LoadableIndex from "oak-roots/LoadableIndex";
import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentLoader from "./ComponentLoader";
import ProjectComponent from "./ProjectComponent";
import StackController from "./StackController";



export default class ProjectController extends Loadable() {
  constructor(props) {
    super();
    Object.assign(this, props);
    objectUtil.dieIfMissing(this, ["app", "projectId"]);

    this.cache = {};
    this.initializeStackIndex();
    this.initializeComponentLoader();
  }

  //////////////////////////////
  //  Initialize our loadable bits
  //////////////////////////////

  initializeStackIndex() {
    this.stackIndex = new LoadableIndex({
      itemType: "stack",
      loadIndex: () => {
        return api.loadStackIndex(this);
      },
      createChild: (stackId, props) => {
        return new StackController({
          props: {
            project: this.id,
            stack: stackId,
            ...props
          },
          app: this.app,
          project: this,
        });
      }
    });
  }

  initializeComponentLoader() {
    this.componentLoader = new ProjectLoader({ controller: this });
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////

  get id() { return this.projectId }
  get projectId() { return this.props && this.props.project }

  get path() { return this.projectId }
  get selector() { return `.oak.Project#${this.id}` }
  get title() { return ( this.props && this.props.title ) || this.id }
  get type() { return "project" }

  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return this.app.getProjectTheme(this.id) }

  getComponent(type, errorMessage) {
    return this.app.getComponent(type, errorMessage, this.components);
  }

  get ComponentConstructor() { return this.componentLoader.ComponentConstructor }

  //////////////////////////////
  //  Stacks
  //////////////////////////////

  get stackIds() { return this.stackIndex.ids }

  getStack(stackIdentifier) {
    return this.stackIndex.getItem(stackIdentifier);
  }

  loadStack(stackIdentifier) {
    return this.stackIndex.loadItem(stackIdentifier);
  }


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  static get route() { return this.app.getCardRoute(this.id) }

  loadData() {
    return Promise.all([
        this.stackIndex.load(),
        this.componentLoader.load(),
      ])
      .then(() => this );
  }

}



//////////////////////////////
// ProjectLoader class
//////////////////////////////

export class ProjectLoader extends ComponentLoader {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["controller"]);
  }

  loadData() {
    return api.loadComponentBundle(this.controller)
      .then(bundle => {
        this.mutate(bundle);
        return this
      });
  }

  get app() { return this.controller.app }
  get id() { return this.controller.id }
  get path() { return this.controller.path }
  get type() { return this.controller.type; }
  get selector() { return this.controller.selector }

  _createComponentConstructor() {
    const Constructor = super._createComponentConstructor(ProjectComponent, "Project_"+this.id);
    Constructor.controller = this.controller;
    return Constructor;
  }
}


//////////////////////////////
// ProjectElement class
//////////////////////////////

import JSXElement from "./JSXElement";
import { classNames } from "oak-roots/util/react";

// Create a specialized `ProjectElement` and export it
export class ProjectElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    project: "this",
    app: "project.app",
    components: "project.components",
    data: "project.data"
  }

  // Render out outer element as a div with only a few properties
  renderType = "div";
  _attributesToSource(options, indent) {
    const { id, className, style } = this.attributes || {};
    return super._attributesToSource(options, indent, {
      id,
      className: classNames("oak Project", className),
      style
    });
  }
}

// Register it so `<OakProject>` elements in a jsxe will use `ProjectElement`.
JSXElement.registerType("OakProject", ProjectElement);

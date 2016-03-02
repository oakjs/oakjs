//////////////////////////////
// Project class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import LoadableIndex from "oak-roots/LoadableIndex";
import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/object";

import api from "./api";
import ComponentController from "./ComponentController";
import ComponentLoader from "./ComponentLoader";
import OakProject from "./components/OakProject";
import Stack from "./Stack";



export default class Project extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, ["app", "projectId"]);
    this.initializeStackIndex();
  }

  @proto
  type = "project";


  //////////////////////////////
  //  Identity & Sugar
  //////////////////////////////

  get id() { return this.projectId }
  get path() { return this.projectId }

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
  //  Initialization / Loading / Saving
  //////////////////////////////

  static get route() { return this.app.getCardRoute(this.id) }

  initializeComponentLoader() {
    this.componentLoader = new ProjectLoader({ controller: this });
  }

  initializeStackIndex() {
    this.stackIndex = new LoadableIndex({
      itemType: "stack",
      loadIndex: () => {
        return api.loadStackIndex(this);
      },
      createItem: (stackId, props) => {
        return new Stack({
          ...props,
          app: this.app,
          stackId,
          projectId: this.id,
        });
      }
    });
  }

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
    dieIfMissing(this, ["controller"]);
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

  _createComponentConstructor() {
    const Constructor = super._createComponentConstructor(OakProject, "Project_"+this.id);
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

  // Use `getRenderProps()` to massage the attributes passed in
  _attributesToSource(options, indent) {
    const attributeSource = super._attributesToSource(options, indent);
    return `this.getRenderProps(${attributeSource})`;
  }
}

// Register it so `<OakProject>` elements in a jsxe will use `ProjectElement`.
JSXElement.registerType("OakProject", ProjectElement);

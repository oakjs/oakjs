//////////////////////////////
// ProjectController class
//////////////////////////////

import LoadableIndex from "oak-roots/LoadableIndex";
import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentLoader from "./ComponentLoader";
import ProjectComponent from "./ProjectComponent";
import StackController from "./StackController";



export default class ProjectController extends ComponentLoader {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app", "projectId"]);

    this.initializeStackIndex();
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
    const Constructor = super._createComponentConstructor(ProjectComponent, "Project");
    Constructor.id = this.id;
    Constructor.controller = this;
    Constructor.app = this.app;

    return Constructor;
  }

  // TODO: dynamic components
  get components() { return this.app.getProjectTheme(this.id) }

  //////////////////////////////
  //  Stacks
  //////////////////////////////

  initializeStackIndex() {
    this.stackIndex = new LoadableIndex({
      itemType: "stack",
      loadIndex: () => {
        return api.loadStackIndex(this);
      },
      createChild: (index, stackId, props) => {
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
    });
  }

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

  loadData() {
    return Promise.all([
        this.stackIndex.load(),
        api.loadControllerBundle(this),
      ])
      .then(([ stacks, { jsxElement, styles, script } ]) => {
        this.mutate({ jsxElement, styles, script });
        return this;
      });
  }

// UNTESTED
//   saveData() {
//     return Promise.all([
//         this.stackIndex.save(),
//         api.saveControllerJSXE(this),
//         api.saveControllerStyles(this),
//         api.saveControllerScript(this)
//       ])
//       .then( () => { this } );
//   }

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

// Register it so `<Project>` elements in a jsxe will use `ProjectElement`.
JSXElement.registerType("Project", ProjectElement);

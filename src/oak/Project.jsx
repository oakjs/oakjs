//////////////////////////////
// Project class
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/object";

import ComponentController from "./ComponentController";

export default class Project extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, ["app", "projectId"]);
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

  get componentLoader() {
    return this.app.getProjectLoader(this);
  }

  // TODO: dynamic components
  get components() { return this.app.getProjectTheme(this.projectId) }

  get component() { if (app.project === this) return app._projectComponent }


  //////////////////////////////
  //  Stacks
  //////////////////////////////

  get stackIndex() { return this.app.getStackIndex(this.path) }

  get stacks() { return this.stackIndex.items }
  get stackIds() { return this.stackIndex.itemIds }
  get stackMap() { return this.stackIndex.itemMap }

  getStack(stackIdentifier) {
    return this.stackIndex.getItem(stackIdentifier);
  }

  loadStack(stackIdentifier) {
    return this.stackIndex.loadItem(stackIdentifier);
  }


  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  static get route() { return this.app.getCardRoute(this.projectId) }

  loadData() {
    return Promise.all([
        this.stackIndex.load(),
        this.componentLoader.load(),
      ])
      .then(() => this );
  }

}

//////////////////////////////
// ProjectElement class
//////////////////////////////

import JSXElement from "./JSXElement";

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

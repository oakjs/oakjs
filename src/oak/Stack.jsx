//////////////////////////////
// Stack class
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/object";

import ComponentController from "./ComponentController";

export default class Stack extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, ["app", "stackId", "projectId"]);
  }

  @proto
  type = "stack";


  //////////////////////////////
  //  Identity & Sugar
  //////////////////////////////

  get id() { return this.stackId }
  get path() { return `${this.projectId}/${this.stackId}` }

  get project() { return this.app.getProject(this.projectId) }

  //////////////////////////////
  //  Components
  //////////////////////////////

  get componentLoader() {
    return this.app.getStackLoader(this);
  }

  // TODO: dynamic components
  get components() { return this.project.components }

  get component() { if (app.stack === this) return app._stackComponent }

  //////////////////////////////
  //  Cards
  //////////////////////////////

  get cardIndex() { return this.app.getCardIndex(this.path) }

  get cards() { return this.cardIndex.items }
  get cardIds() { return this.cardIndex.itemIds }
  get cardMap() { return this.cardIndex.itemMap }

  getCard(cardIdentifier) {
    return this.cardIndex.getItem(cardIdentifier);
  }

  loadCard(cardIdentifier) {
    return this.cardIndex.loadItem(cardIdentifier);
  }

  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  static get route() { return this.app.getCardRoute(this.projectId, this.stackId) }

  loadData() {
    return Promise.all([
        this.cardIndex.load(),
        this.componentLoader.load()
      ])
      .then(() => this );
  }

}


//////////////////////////////
// StackElement class
//////////////////////////////

import JSXElement from "./JSXElement";

// Create a specialized `StackElement` and export it
export class StackElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    stack: "this",
    app: "stack.app",
    project: "stack.project",
    components: "stack.components",
    data: "stack.data"
  }
  // Render out outer element as a div with only a few properties
  renderType = "div";

  // Use `getRenderProps()` to massage the props passed in
  _propsToSource(options, indent) {
    const propSource = super._propsToSource(options, indent);
    return `this.getRenderProps(${propSource})`;
  }
}

// Register it so `<OakStack>` elements in a jsxe will use `StackElement`.
JSXElement.registerType("OakStack", StackElement);

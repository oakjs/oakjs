//////////////////////////////
// StackController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import CardIndex from "./CardIndex";
import ComponentController from "./ComponentController";
import OakStack from "./Stack";

export default class StackController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app", "stackId", "projectId"]);

    // create our card index
    this.cards = new CardIndex({ app: this.app, stack: this, path: this.path });
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////

  static type = "stack";

  get id() { return this.stackId }
  get stackId() { return this.props && this.props.stack }
  get projectId() { return this.props && this.props.project }

  get path() { return `${this.projectId}/${this.stackId}` }
  get selector() { return `.oak.Stack#${this.id}` }

  _createComponentConstructor() {
    return class Stack extends OakStack {};
  }


  //////////////////////////////
  //  Cards
  //////////////////////////////

  get cardIds() { return this.cards.ids }

  getCard(cardIdentifier) {
    return this.cards.get(cardIdentifier);
  }

  loadCard(cardIdentifier) {
    return this.cards.loadCard(cardIdentifier);
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return Promise.all([
        this.cards.load(),
        api.loadControllerJSXE(this),
        api.loadControllerStyles(this),
        api.loadControllerScript(this)
      ])
      .then( ([ cards, component, styles, script ]) => {
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



//////////////////////////////
// StackElement class
//////////////////////////////

import JSXElement from "./JSXElement";

// Create a specialized `StackElement` and export it
export class StackElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    app: "context.app",
    stack: "context.stack",
    project: "context.project",
    components: "context.components",
    data: "stack.data"
  }
  // Render out outer element as a div with only a few properties
  renderType = "div";
  _attributesToSource(options, indent) {
    const { id, className, style } = this.attributes;
    return super._attributesToSource(options, indent, {
      id,
      className: classNames("oak Stack", className),
      style
    });
  }
}

// Register it so `<Stack>` elements in a jsxe will use `StackElement`.
JSXElement.registerType("Stack", StackElement);

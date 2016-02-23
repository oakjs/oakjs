//////////////////////////////
// CardController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import OakCard from "./Card";
import ComponentController from "./ComponentController";


export default class CardController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app", "project", "stack", "cardId", "stackId", "projectId"]);
  }

  //////////////////////////////
  //  Identify
  //////////////////////////////

  static type = "card";

  get id() { return this.cardId }
  get cardId() { return this.props && this.props.card }
  get stackId() { return this.props && this.props.stack }
  get projectId() { return this.props && this.props.project }

  get path() { return `${this.projectId}/${this.stackId}/${this.cardId}` }
  get selector() { return `.oak.Card#${this.id}` }

  _createComponentConstructor() {
    return class Card extends OakCard {
      static id = this.id;
      static controller = this;
      static app = this.app;
      static project = this.project;
      static stack = this.stack;
    };
  }

  // TODO: dynamic components
  get components() { return this.stack.components }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
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
      component: api.saveControllerJSXE(this),
      styles: api.saveControllerStyles(this),
      script: api.saveControllerScript(this)
    });
  }

}

//////////////////////////////
// CardElement class
//////////////////////////////

import JSXElement from "./JSXElement";
import { classNames } from "oak-roots/util/react";

// Create a specialized `CardElement` and export it
export class CardElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    app: "context.app",
    card: "context.card",
    stack: "context.stack",
    project: "context.project",
    components: "context.components",
    data: "card.data"
  }
  // Render out outer element as a div with only a few properties
  renderType = "div";
  _attributesToSource(options, indent) {
    const { id, className, style } = this.attributes;
    return super._attributesToSource(options, indent, {
      id,
      className: classNames("oak Card", className),
      style
    });
  }
}

// Register it so `<Card>` elements in a jsxe will use `CardElement`.
JSXElement.registerType("Card", CardElement);

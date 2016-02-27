//////////////////////////////
// CardController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import CardComponent from "./CardComponent";
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
    const Constructor = super._createComponentConstructor(CardComponent, "Card");

    Constructor.id = this.id;
    Constructor.controller = this;
    Constructor.app = this.app;
    Constructor.project = this.project;
    Constructor.stack = this.stack;

    return Constructor;
  }

  // TODO: dynamic components
  get components() { return this.stack.components }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.loadControllerBundle(this)
      .then( ({ jsxElement, styles, script }) => {
        this.mutate({ jsxElement, styles, script });
        return this;
      });
  }

// UNTESTED
//   saveData() {
//     return api.map({
//       jsxElement: api.saveControllerJSXE(this),
//       styles: api.saveControllerStyles(this),
//       script: api.saveControllerScript(this)
//     });
//   }
//
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
    card: "this",
    app: "card.app",
    stack: "card.stack",
    project: "card.project",
    components: "card.components",
    data: "card.data"
  }
  // Render out outer element as a div with only a few properties
  renderType = "div";
  _attributesToSource(options, indent) {
    const { id, className, style } = this.attributes || {};
    return super._attributesToSource(options, indent, {
      id,
      className: classNames("oak Card", className),
      style
    });
  }
}

// Register it so `<Card>` elements in a jsxe will use `CardElement`.
JSXElement.registerType("OakCard", CardElement);

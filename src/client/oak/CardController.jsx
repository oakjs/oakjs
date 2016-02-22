//////////////////////////////
// CardController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import Card from "./Card";
import ComponentController from "./ComponentController";

export default class CardController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["cardId", "stackId", "projectId"]);
  }

  //////////////////////////////
  //  Identify
  //////////////////////////////

  static type = "card";
  static baseComponentConstructor = Card;

  get id() { return this.cardId }
  get path() { return `${this.projectId}/${this.stackId}/${this.cardId}` }
  get selector() { return `.oak.Card#${this.cardId}` }

  get cardId() { return this.props && this.props.card }
  get stackId() { return this.props && this.props.stack }
  get projectId() { return this.props && this.props.project }

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

// Create a specialized `CardElement` and export it
export class CardElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    card: "context.card",
    stack: "context.stack",
    project: "context.project",
    components: "context.components",
    data: "card.data"
  }
}

// Register it so `<Card>` elements in a jsxe will use `CardElement`.
JSXElement.registerType("Card", CardElement);

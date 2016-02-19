//////////////////////////////
// CardController class
//////////////////////////////

import decorators from "oak-roots/util/decorators";
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

  @decorators.proto
  static type = "card";

  @decorators.proto
  static baseComponentConstructor = Card;

  get id() { return `${this.projectId}-${this.stackId}-${this.cardId}` }
  get path() { return `${this.projectId}/${this.stackId}/${this.cardId}` }
  get selector() { return `.oak.Card#${this.cardId}` }

  get cardId() { return this.attributes && this.attributes.card }
  get stackId() { return this.attributes && this.attributes.stack }
  get projectId() { return this.attributes && this.attributes.project }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
      component: api.loadControllerJSXE(this),
      styles: api.loadControllerStyles(this),
      script: api.loadControllerScript(this)
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

//////////////////////////////
// StackController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentController from "./ComponentController";
import OakStack from "./Stack";

export default class StackController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["stackId", "projectId"]);
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////

  static type = "stack";

  get id() { return this.stackId }
  get stackId() { return this.props && this.props.stack }
  get projectId() { return this.props && this.props.project }

  get path() { return `${this.projectId}/${this.stackId}` }
  get selector() { return `.oak.Stack#${this.stackId}` }

  // IFF we've loaded, return the card id for a card specified by index or id.
  // If we haven't loaded or we don't know about the card, returns `undefined`.
  getCardId(cardIdentifier) {
    if (this.index) {
      if (typeof cardIdentifier === "string") {
        return this.index[cardIdentifier] && cardIdentifier;
      }
      else if (typeof cardIdentifier === "number") {
        return Object.keys(this.index)[cardIdentifier];
      }
      else {
        console.error(`${this}.getCardId(${cardIdentifier}): don't understand identifier`);
      }
    }
    return undefined;
  }

  _createComponentConstructor() {
    return class Stack extends OakStack {};
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
      index: api.loadControllerIndex(this),
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
      index: api.saveControllerIndex(this),
      component: api.saveControllerJSXE(this),
      styles: api.saveControllerStyles(this),
      script: api.saveControllerScript(this)
    });
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
    stack: "context.stack",
    project: "context.project",
    components: "context.components",
    data: "stack.data"
  }
}

// Register it so `<Stack>` elements in a jsxe will use `StackElement`.
JSXElement.registerType("Stack", StackElement);

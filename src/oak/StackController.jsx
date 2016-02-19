//////////////////////////////
// StackController class
//////////////////////////////

import decorators from "oak-roots/util/decorators";
import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentController from "./ComponentController";
import Stack from "./Stack";

export default class StackController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["stackId", "projectId"]);
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////

  @decorators.proto
  static type = "stack";

  @decorators.proto
  static baseComponentConstructor = Stack;

  get id() { return `${this.projectId}-${this.stackId}` }
  get path() { return `${this.projectId}/${this.stackId}` }
  get selector() { return `.oak.Stack#${this.stackId}` }

  get stackId() { return this.attributes && this.attributes.stack }
  get projectId() { return this.attributes && this.attributes.project }


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
      childIndex: api.loadControllerChildIndex(this),
      component: api.loadControllerJSXE(this),
      styles: api.loadControllerStyles(this),
      script: api.loadControllerScript(this)
    });
  }

  saveData() {
    return api.map({
      childIndex: api.saveControllerChildIndex(this),
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

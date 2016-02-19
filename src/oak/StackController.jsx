//////////////////////////////
// StackController class
//////////////////////////////

import ComponentController from "./ComponentController";
import Stack from "./Stack";

import decorators from "oak-roots/util/decorators";

export default class StackController extends ComponentController {
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

  dieIfNotIdentified(errorMessage) {
    this.dieIfMissing(["stackId", "projectId"], errorMessage);
  }


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    super.loadData();
    return Promise.all([this.loadChildIndex(), this.loadComponent(), this.loadStyle(), this.loadScript()])
      .then(([childIndex, component, style, script]) => {
        return { childIndex, component, style, script }
      });
  }

  saveData() {
    super.saveData();
    return Promise.all([this.saveChildIndex(), this.saveComponent(), this.saveStyle(), this.saveScript()]);
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

//////////////////////////////
// StackController class
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import CardController from "./CardController";
import ComponentIndex from "./ComponentIndex";
import ComponentController from "./ComponentController";
import StackComponent from "./StackComponent";


export default class StackController extends ComponentController {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app", "project", "stackId", "projectId"]);

    this.initializeCardIndex();
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

  _createComponentConstructor(renderMethod) {
    const Constructor = super._createComponentConstructor(StackComponent, "Stack");
    Constructor.id = this.id;
    Constructor.controller = this;
    Constructor.app = this.app;
    Constructor.project = this.project;

    return Constructor;
  }

  // TODO: dynamic components
  get components() { return this.project.components }

  //////////////////////////////
  //  Cards
  //////////////////////////////

  initializeCardIndex() {
    this.cardIndex = new ComponentIndex({
      controller: this,
      type: "stack",
      createChild: (index, cardId, props) => {
        return new CardController({
          app: this.app,
          project: this.project,
          stack: this,
          props: {
            project: this.projectId,
            stack: this.stackId,
            card: cardId,
            ...props
          }
        });
      }
    });
  }

  get cardIds() { return this.cardIndex.ids }

  getCard(cardIdentifier) {
    return this.cardIndex.get(cardIdentifier);
  }

  loadCard(cardIdentifier) {
    return this.cardIndex.loadComponent(cardIdentifier);
  }

  // Return a map of { cardId => { card, stack, project, title, route } }
  // Used by, e.g., <CardMenu/>
  get cardMap() {
    if (this.cache.cardMap) return this.cache.cardMap;

    if (!this.cardIndex.index) return {};

    const cardMap = this.cache.cardMap = {};
    const { stackId: stack, projectId: project } = this;

    Object.keys(this.cardIndex.index).map(card => {
      const info = this.cardIndex.index[card];
      cardMap[card] = {
        card,
        stack,
        project,
        ...info,
        route: app.getCardRoute(project, stack, card)
      }
    });

    return cardMap;
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return Promise.all([
        this.cardIndex.load(),
        api.loadControllerBundle(this),
      ])
      .then(([ cards, { component, styles, script } ]) => {
        this.mutate({ component, styles, script });
        return this;
      });
  }

// UNTESTED
//   saveData() {
//     return Promise.all([
//         this.cardIndex.save(),
//         api.saveControllerJSXE(this),
//         api.saveControllerStyles(this),
//         api.saveControllerScript(this)
//       ])
//       .then( () => { this } );
//   }

}



//////////////////////////////
// StackElement class
//////////////////////////////

import JSXElement from "./JSXElement";
import { classNames } from "oak-roots/util/react";

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
  _attributesToSource(options, indent) {
    const { id, className, style } = this.attributes || {};
    return super._attributesToSource(options, indent, {
      id,
      className: classNames("oak Stack", className),
      style
    });
  }
}

// Register it so `<Stack>` elements in a jsxe will use `StackElement`.
JSXElement.registerType("Stack", StackElement);

//////////////////////////////
// Stack class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import LoadableIndex from "oak-roots/LoadableIndex";
import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/object";

import api from "./api";
import Card from "./Card";
import ComponentController from "./ComponentController";
import ComponentLoader from "./ComponentLoader";
import OakStack from "./components/OakStack";


export default class Stack extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, ["app", "stackId", "projectId"]);
    this.initializeCardIndex();
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

  // TODO: dynamic components
  get components() { return this.project.components }

  getComponent(type, errorMessage) {
    return this.app.getComponent(type, errorMessage, this.components);
  }

  get ComponentConstructor() { return this.componentLoader.ComponentConstructor }


  //////////////////////////////
  //  Cards
  //////////////////////////////

  get cardIds() { return this.cardIndex.ids }

  getCard(cardIdentifier) {
    return this.cardIndex.getItem(cardIdentifier);
  }

  loadCard(cardIdentifier) {
    return this.cardIndex.loadItem(cardIdentifier);
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
  //  Initialization / Loading / Saving
  //////////////////////////////

  static get route() { return this.app.getCardRoute(this.project.id, this.id) }

  initializeComponentLoader() {
    this.componentLoader = new StackLoader({ controller: this });
  }

  initializeCardIndex() {
    this.cardIndex = new LoadableIndex({
      itemType: "card",
      loadIndex: () => {
        return api.loadCardIndex(this);
      },
      createItem: (cardId, props) => {
        return new Card({
          ...props,
          app: this.app,
          cardId,
          stackId: this.stackId,
          projectId: this.projectId,
        });
      }
    });
  }

  loadData() {
    return Promise.all([
        this.cardIndex.load(),
        this.componentLoader.load()
      ])
      .then(() => this );
  }

}


//////////////////////////////
// StackLoader class
//////////////////////////////

export class StackLoader extends ComponentLoader {
  constructor(...args) {
    super(...args);
    dieIfMissing(this, ["controller"]);
  }

  loadData() {
    return api.loadComponentBundle(this.controller)
      .then(bundle => {
        this.mutate(bundle);
        return this
      });
  }

  get app() { return this.controller.app }
  get project() { return this.controller.project }

  get id() { return this.controller.id }
  get path() { return this.controller.path }
  get type() { return this.controller.type; }

  _createComponentConstructor() {
    const Constructor = super._createComponentConstructor(OakStack, "Stack_"+this.id);
    Constructor.controller = this.controller;
    return Constructor;
  }
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

  // Use `getRenderProps()` to massage the attributes passed in
  _attributesToSource(options, indent) {
    const attributeSource = super._attributesToSource(options, indent);
    return `this.getRenderProps(${attributeSource})`;
  }
}

// Register it so `<OakStack>` elements in a jsxe will use `StackElement`.
JSXElement.registerType("OakStack", StackElement);

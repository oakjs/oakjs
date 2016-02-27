//////////////////////////////
// StackController class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import LoadableIndex from "oak-roots/LoadableIndex";
import objectUtil from "oak-roots/util/object";

import api from "./api";
import CardController from "./CardController";
import ComponentLoader from "./ComponentLoader";
import StackComponent from "./StackComponent";


export default class StackController extends Loadable() {
  constructor(props) {
    super();
    Object.assign(this, props);
    objectUtil.dieIfMissing(this, ["app", "project", "stackId", "projectId"]);

    this.cache = {};
    this.initializeCardIndex();
    this.initializeComponentLoader();
  }


  //////////////////////////////
  //  Initialize our loadable bits
  //////////////////////////////

  initializeCardIndex() {
    this.cardIndex = new LoadableIndex({
      itemType: "card",
      loadIndex: () => {
        return api.loadCardIndex(this);
      },
      createChild: (cardId, props) => {
        return new CardController({
          props: {
            project: this.projectId,
            stack: this.stackId,
            card: cardId,
            ...props
          },
          app: this.app,
          project: this.project,
          stack: this,
        });
      }
    });
  }

  initializeComponentLoader() {
    this.componentLoader = new StackLoader({ controller: this });
  }

  //////////////////////////////
  //  Identity
  //////////////////////////////


  get id() { return this.stackId }
  get stackId() { return this.props && this.props.stack }
  get projectId() { return this.props && this.props.project }

  get path() { return `${this.projectId}/${this.stackId}` }
  get selector() { return `.oak.Stack#${this.id}` }
  get title() { return ( this.props && this.props.title ) || this.id }
  get type() { return "stack" }


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
  //  Loading / Saving
  //////////////////////////////

  static get route() { return this.app.getCardRoute(this.project.id, this.id) }

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
    objectUtil.dieIfMissing(this, ["controller"]);
  }

  loadData() {
    return api.loadComponentBundle(this.controller)
      .then(bundle => {
        this.mutate(bundle);
        return this
      });
  }

  get app() { return this.controller.app }
  get id() { return this.controller.id }
  get path() { return this.controller.path }
  get project() { return this.controller.project }
  get type() { return this.controller.type; }
  get selector() { return this.controller.selector }

  _createComponentConstructor() {
    const Constructor = super._createComponentConstructor(StackComponent, "Stack_"+this.id);
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

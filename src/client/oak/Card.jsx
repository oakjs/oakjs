//////////////////////////////
// Card class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import objectUtil from "oak-roots/util/object";
import { unknownProperties } from "oak-roots/util/react";

import api from "./api";
import OakCard from "./components/OakCard";
import ComponentLoader from "./ComponentLoader";


export default class Card extends Loadable() {
  constructor(props) {
    super();
    Object.assign(this, props);
    objectUtil.dieIfMissing(this, ["app", "project", "stack", "cardId", "stackId", "projectId"]);

    this.cache = {};
    this.initializeComponentLoader();
  }

  //////////////////////////////
  //  Initialize our loadable bits
  //////////////////////////////

  initializeComponentLoader() {
    this.componentLoader = new CardLoader({ controller: this });
  }

  //////////////////////////////
  //  Identify
  //////////////////////////////

  get id() { return this.cardId }
  get cardId() { return this.props && this.props.card }
  get stackId() { return this.props && this.props.stack }
  get projectId() { return this.props && this.props.project }

  get path() { return `${this.projectId}/${this.stackId}/${this.cardId}` }
  get selector() { return `.oak.Card#${this.id}` }
  get title() { return ( this.props && this.props.title ) || this.id }
  get type() { return "card" }


  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return this.stack.components }

  getComponent(type, errorMessage) {
    return this.app.getComponent(type, errorMessage, this.components);
  }

  get ComponentConstructor() { return this.componentLoader.ComponentConstructor }


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  static get route() { return this.app.getCardRoute(this.project.id, this.stack.id, this.id) }

  loadData() {
    return this.componentLoader.load()
            .then( () => this );
  }
}


//////////////////////////////
// CardLoader class
//////////////////////////////

export class CardLoader extends ComponentLoader {
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
  get stack() { return this.controller.stack }

  _createComponentConstructor() {
    const Constructor = super._createComponentConstructor(OakCard, "Card_"+this.id);
    Constructor.controller = this.controller;
    return Constructor;
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
    card: "this",
    app: "card.app",
    stack: "card.stack",
    project: "card.project",
    components: "card.components",
    data: "card.data"
  }
  // Render out outer element as a div with only a few properties
  renderType = "div";

  // Use `getRenderProps()` to massage the attributes passed in
  _attributesToSource(options, indent) {
    const attributeSource = super._attributesToSource(options, indent);
    return `this.getRenderProps(${attributeSource})`;
  }
}

// Register it so `<Card>` elements in a jsxe will use `CardElement`.
JSXElement.registerType("OakCard", CardElement);

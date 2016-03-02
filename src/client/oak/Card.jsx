//////////////////////////////
// Card class
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/object";
import { unknownProperties } from "oak-roots/util/react";

import api from "./api";
import ComponentController from "./ComponentController";
import ComponentLoader from "./ComponentLoader";
import OakCard from "./components/OakCard";


export default class Card extends ComponentController {
  constructor(props) {
    super(props);
    Object.assign(this, props);
    dieIfMissing(this, ["app", "cardId", "stackId", "projectId"]);
  }

  @proto
  type = "card";

  //////////////////////////////
  //  Identify & Sugar
  //////////////////////////////

  get id() { return this.cardId }
  get path() { return `${this.projectId}/${this.stackId}/${this.cardId}` }

  get project() { return this.app.getProject(this.projectId) }
  get stack() { return this.app.getStack(this.projectId, this.stackId) }


  //////////////////////////////
  //  Components
  //////////////////////////////

  initializeComponentLoader() {
    this.componentLoader = new CardLoader({ controller: this });
  }

  // TODO: dynamic components
  get components() { return this.stack.components }


  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  get route() { return this.app.getCardRoute(this.projectId, this.stackId, this.cardId) }

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
    dieIfMissing(this, ["controller"]);
  }

  get id() { return this.controller.path }

  loadData() {
    return api.loadComponentBundle(this.controller)
      .then(bundle => {
        this.mutate(bundle);
        return this
      });
  }

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

//////////////////////////////
// Card class
//////////////////////////////

import { proto, debounce   } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import ComponentController from "./ComponentController";

export default class Card extends ComponentController {
  constructor(props) {
    dieIfMissing(props, "new Card", ["app", "cardId", "sectionId", "projectId"]);
    super(props);
  }

  @proto
  type = "card";

  //////////////////////////////
  //  Identify & Sugar
  //////////////////////////////

  get id() { return this.cardId }
  get path() { return `${this.projectId}/${this.sectionId}/${this.cardId}` }

  get project() { return this.app.getProject(this.projectId) }
  get section() { return this.app.getSection(this.projectId, this.sectionId) }


  //////////////////////////////
  //  Components
  //////////////////////////////

  createComponentLoader() {
    return this.app.getCardLoader(this, "MAKE");
  }

  // TODO: dynamic components
  get components() { return this.section.components }

  get component() { if (app.card === this) return app.cardComponent }

  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  get route() { return this.app.getCardRoute(this.projectId, this.sectionId, this.cardId) }

  loadData() {
    return this.componentLoader.load()
            .then( () => this );
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
    card: "this",
    app: "card.app",
    section: "card.section",
    project: "card.project",
    components: "card.components",
    data: "card.data"
  }
  // Render out outer element as a div with only a few properties
  renderType = "div";

  // Use `getRenderProps()` to massage the props passed in
  _propsToSource(options, indent) {
    const propSource = super._propsToSource(options, indent);
    return `this.getRenderProps(${propSource})`;
  }
}

// Register it so `<Card>` elements in a jsxe will use `CardElement`.
JSXElement.registerType("OakCard", CardElement);

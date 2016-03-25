//////////////////////////////
// Section class
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import ComponentController from "./ComponentController";

export default class Section extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Section", ["app", "sectionId", "projectId"]);
  }

  @proto
  type = "section";


  //////////////////////////////
  //  Identity & Sugar
  //////////////////////////////

  get id() { return this.sectionId }
  get path() { return `${this.projectId}/${this.sectionId}` }

  get project() { return this.app.getProject(this.projectId) }

  //////////////////////////////
  //  Components
  //////////////////////////////

  createComponentLoader() {
    return this.app.getSectionLoader(this, "MAKE");
  }

  // TODO: dynamic components
  get components() { return this.project.components }

  get component() { if (app.section === this) return app.sectionComponent }

  //////////////////////////////
  //  Cards
  //////////////////////////////

  get cardIndex() { return this.app.getCardIndex(this.path) }

  get cards() { return this.cardIndex.items }
  get cardIds() { return this.cardIndex.itemIds }
  get cardMap() { return this.cardIndex.itemMap }

  getCard(cardIdentifier) {
    return this.cardIndex.getItem(cardIdentifier);
  }

  loadCard(cardIdentifier) {
    return this.cardIndex.loadItem(cardIdentifier);
  }

  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  static get route() { return this.app.getCardRoute(this.projectId, this.sectionId) }

  loadData() {
    return Promise.all([
        this.cardIndex.load(),
        this.componentLoader.load()
      ])
      .then(() => this );
  }

}


//////////////////////////////
// SectionElement class
//////////////////////////////

import JSXElement from "./JSXElement";

// Create a specialized `SectionElement` and export it
export class SectionElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    section: "this",
    app: "section.app",
    project: "section.project",
    components: "section.components",
    data: "section.data"
  }
  // Render out outer element as a div with only a few properties
  renderType = "div";

  // Use `getRenderProps()` to massage the props passed in
  _propsToSource(options, indent) {
    const propSource = super._propsToSource(options, indent);
    return `this.getRenderProps(${propSource})`;
  }
}

// Register it so `<OakSection>` elements in a jsxe will use `SectionElement`.
JSXElement.registerType("OakSection", SectionElement);

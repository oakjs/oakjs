//////////////////////////////
// Section class
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import ComponentController from "./ComponentController";

export default class Section extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Section", ["oak", "sectionId", "projectId"]);
  }

  @proto
  type = "section";


  //////////////////////////////
  //  Identity & Sugar
  //////////////////////////////

  get id() { return this.sectionId }
  get path() { return `${this.projectId}/${this.sectionId}` }

  get project() { return this.oak.getProject(this.projectId) }

  //////////////////////////////
  //  Components
  //////////////////////////////

  getComponentLoader() {
    return this.oak.loader.getSectionLoader(this, "MAKE");
  }

  // TODO: dynamic components
  get components() { return this.project.components }

  get component() { if (oak.section === this) return oak._sectionComponent }

  //////////////////////////////
  //  Pages
  //////////////////////////////

  get pageIndex() { return this.oak.loader.getPageIndex(this.path) }

  get pages() { return this.pageIndex.items }
  get pageIds() { return this.pageIndex.itemIds }
  get pageMap() { return this.pageIndex.itemMap }

  getPage(pageIdentifier) {
    return this.pageIndex.getItem(pageIdentifier);
  }

  loadPage(pageIdentifier) {
    return this.pageIndex.loadItem(pageIdentifier);
  }

  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  static get route() { return this.oak.getPageRoute(this.projectId, this.sectionId) }

  loadData() {
    return Promise.all([
        this.pageIndex.load(),
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
    _controller: "context._controller",
    oak: "context.oak",
    page: "context.page",
    section: "context.section",
    project: "context.project",
    components: "context.components",
    data: "this.data || {}"
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

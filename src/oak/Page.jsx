//////////////////////////////
// Page class
//////////////////////////////

import { proto, debounce   } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import ComponentController from "./ComponentController";

export default class Page extends ComponentController {
  constructor(props) {
    dieIfMissing(props, "new Page", ["oak", "pageId", "sectionId", "projectId"]);
    super(props);
  }

  @proto
  type = "page";

  //////////////////////////////
  //  Identify & Sugar
  //////////////////////////////

  get id() { return this.pageId }
  get path() { return `${this.projectId}/${this.sectionId}/${this.pageId}` }

  get project() { return this.oak.getProject(this.projectId) }
  get section() { return this.oak.getSection(this.projectId, this.sectionId) }


  //////////////////////////////
  //  Components
  //////////////////////////////

  getComponentLoader() {
    return this.oak.loader.getPageLoader(this, "MAKE");
  }

  // TODO: dynamic components
  get components() { return this.section.components }

  get component() { if (oak.page === this) return oak._pageComponent }

  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  get route() { return this.oak.getPageRoute(this.projectId, this.sectionId, this.pageId) }

  loadData() {
    return this.componentLoader.load()
            .then( () => this );
  }
}


//////////////////////////////
// PageElement class
//////////////////////////////

import JSXElement from "./JSXElement";

// Create a specialized `PageElement` and export it
export class PageElement extends JSXElement {
  static renderVars = {
    ...JSXElement.renderVars,
    oak: "context.oak",
    _controller: "context._controller",
    page: "context.page",
    section: "context.section",
    project: "context.project",
    components: "context.components",
    data: "(page && page.data) || {}"
  }
  // Render out outer element as a div with only a few properties
  renderType = "div";

  // Use `getRenderProps()` to massage the props passed in
  _propsToSource(options, indent) {
    const propSource = super._propsToSource(options, indent);
    return `this.getRenderProps(${propSource})`;
  }
}

// Register it so `<Page>` elements in a jsxe will use `PageElement`.
JSXElement.registerType("OakPage", PageElement);

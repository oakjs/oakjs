//////////////////////////////
// Page class
//////////////////////////////

import { proto, debounce   } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import ComponentController from "./ComponentController";
import oak from "./oak";

import PageComponent from "./components/Page";

export default class Page extends ComponentController {
  constructor(props) {
    dieIfMissing(props, "new Page", ["pageId", "sectionId", "projectId"]);
    super(props);
  }

  @proto
  type = "page";

  @proto
  ComponentSuperConstructor = PageComponent;

  //////////////////////////////
  //  ChildController stuff
  //////////////////////////////

  // No child index.
  _makeIndex() { return undefined }

  static splitPath(path) {
    const split = path.split("/");
    return { projectId: split[0], sectionId: split[1], pageId: split[2] }
  }

  get id() { return this.pageId }
  set id(id) { this.pageId = id }

  get parent() { return this.section }
  get parentIndex() { return this.section.childIndex }

  getIndexData() { return { id: this.pageId, title: this.title } }

  get route() { return oak.getPageRoute(this.projectId, this.sectionId, this.pageId) }

  //////////////////////////////
  //  Syntactic sugar
  //////////////////////////////

  get project() { return oak.account.getProject(this.projectId) }
  get section() { return oak.account.getSection(this.projectId, this.sectionId) }


  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return this.section.components }

  // REFACTOR: rename this?
  get component() { if (oak.page === this) return oak._pageComponent }


  //////////////////////////////
  //  Data manipulation
  //////////////////////////////

  get data() {
    const component = this.component;
    if (component) return component.data;
  }

  // Get page `data` at path
  get(path, defaultValue){
    const component = this.component;
    if (component) return component.get(path, defaultValue);
  }

  // Get page `data` at path
  set(path, value){
    const component = this.component;
    if (component) return component.set(path, value);
  }

  deferredSet(path, value) {
    return () => this.set(path, value);
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

// Register it so `<Page>` elements in a jsxe will use `PageElement`.
import JSXParser from "./JSXParser";
JSXParser.registerType("Page", PageElement);
JSXParser.registerType("Oak-Page", PageElement);

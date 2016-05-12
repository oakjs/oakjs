//////////////////////////////
// Section class
//////////////////////////////

import LoadableIndex from "oak-roots/LoadableIndex";
import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import api from "./api";
import ComponentController from "./ComponentController";
import Page from "./Page";

import OakSection from "./components/OakSection";

export default class Section extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Section", ["oak", "sectionId", "projectId"]);
  }

  @proto
  type = "section";

  @proto
  ComponentSuperConstructor = OakSection;

  //////////////////////////////
  //  Identity & Sugar
  //////////////////////////////


  get id() { return this.sectionId }
  get path() { return `${this.projectId}/${this.sectionId}` }

  get project() { return this.oak.getProject(this.projectId) }

  // Index of this section in its project.
  // NOTE: this index is 1-based!
  get sectionIndex() { return this.project.sections.indexOf(this) + 1 }
  get isFirstSection() { return this.sectionIndex === 1}
  get isLastSection() { return this.sectionIndex = this.project.sections.length }

  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return this.project.components }

  get component() { if (oak.section === this) return oak._sectionComponent }

  //////////////////////////////
  //  Pages
  //////////////////////////////

  get pageIndex() { return this._index || (this._index = this._makeIndex()) }

  get pages() { return this.pageIndex.items }

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

  // Create the pageIndex on demand.
  _makeIndex() {
    return new LoadableIndex({
      useOneBasedNumbering: true,
      itemType: "page",
      loadData: () => {
        return api.loadPageIndex(this.path);
      },
      createItem: (pageId, props) => {
        // There can be only one.
        const registryPath = `${this.projectId}/${this.sectionId}/${pageId}`;
        let item = this.oak.registry.get(registryPath);

        if (!item) {
          item = new Page({
            pageId,
            sectionId: this.sectionId,
            projectId: this.projectId,
            ...props,
            oak: this.oak,
          });
          this.oak.registry.add(item, registryPath);
        }

        return item;
      }
    });
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
import JSXParser from "./JSXParser";
JSXParser.registerType("OakSection", SectionElement);

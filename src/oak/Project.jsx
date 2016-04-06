//////////////////////////////
// Project class
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import ComponentController from "./ComponentController";

export default class Project extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Project", ["oak", "projectId"]);
  }

  @proto
  type = "project";


  //////////////////////////////
  //  Identity & Sugar
  //////////////////////////////

  get id() { return this.projectId }
  get path() { return this.projectId }

  //////////////////////////////
  //  Components
  //////////////////////////////

  getComponentLoader() {
    return this.oak.loader.getProjectLoader(this, "MAKE");
  }

  // TODO: dynamic components
  get components() { return this.oak.getProjectTheme(this.projectId) }

  get component() { if (oak.project === this) return oak._projectComponent }


  //////////////////////////////
  //  Sections
  //////////////////////////////

  get sectionIndex() { return this.oak.loader.getSectionIndex(this.path) }

  get sections() { return this.sectionIndex.items }
  get sectionIds() { return this.sectionIndex.itemIds }
  get sectionMap() { return this.sectionIndex.itemMap }

  getSection(sectionIdentifier) {
    return this.sectionIndex.getItem(sectionIdentifier);
  }

  loadSection(sectionIdentifier) {
    return this.sectionIndex.loadItem(sectionIdentifier);
  }


  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  get route() { return this.oak.getPageRoute(this.projectId) }

  loadData() {
    return Promise.all([
        this.sectionIndex.load(),
        this.componentLoader.load(),
      ])
      .then(() => this );
  }

}

//////////////////////////////
// ProjectElement class
//////////////////////////////

import JSXElement from "./JSXElement";

// Create a specialized `ProjectElement` and export it
export class ProjectElement extends JSXElement {
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

// Register it so `<OakProject>` elements in a jsxe will use `ProjectElement`.
JSXElement.registerType("OakProject", ProjectElement);

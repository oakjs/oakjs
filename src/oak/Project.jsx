//////////////////////////////
// Project class
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import ComponentController from "./ComponentController";

export default class Project extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Project", ["app", "projectId"]);
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

  createComponentLoader() {
    return this.app.getProjectLoader(this, "MAKE");
  }

  // TODO: dynamic components
  get components() { return this.app.getProjectTheme(this.projectId) }

  get component() { if (app.project === this) return app.projectComponent }


  //////////////////////////////
  //  Sections
  //////////////////////////////

  get sectionIndex() { return this.app.getSectionIndex(this.path) }

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

  get route() { return this.app.getPageRoute(this.projectId) }

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
    project: "this",
    app: "project.app",
    components: "project.components",
    data: "project.data"
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

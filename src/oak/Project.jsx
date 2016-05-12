//////////////////////////////
// Project class
//////////////////////////////

import LoadableIndex from "oak-roots/LoadableIndex";
import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import api from "./api";
import ComponentController from "./ComponentController";
import Section from "./Section";

import OakProject from "./components/OakProject";

export default class Project extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Project", ["oak", "projectId"]);
  }

  // Given a projectId string (NOT an index), return the singleton Project for it.
  static getProject(projectId) {
    return
  }

  @proto
  type = "project";

  @proto
  ComponentSuperConstructor = OakProject;

  //////////////////////////////
  //  Identity & Sugar
  //////////////////////////////

  get id() { return this.projectId }
  get path() { return this.projectId }

  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return this.oak.getProjectTheme(this.projectId) }

  get component() { if (oak.project === this) return oak._projectComponent }


  //////////////////////////////
  //  Sections
  //////////////////////////////

  get sectionIndex() { return this._index || (this._index = this._makeIndex()) }
  get sections() { return this.sectionIndex.items }

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

  // Create the sectionIndex on demand
  _makeIndex() {
    return new LoadableIndex({
      itemType: "section",
      indexProperties: {
        id: "id",
        title: "title"
      },
      loadData: () => {
        return api.loadSectionIndex(this.projectId);
      },
      createItem: (sectionId, props) => {
        // There can be only one.
        const registryPath = `${this.projectId}/${sectionId}`;
        let item = this.oak.registry.get(registryPath);

        if (!item) {
          item = new Section({
            sectionId,
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
import JSXParser from "./JSXParser";
JSXParser.registerType("OakProject", ProjectElement);

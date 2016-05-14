//////////////////////////////
// Project class
//////////////////////////////

import ids from "oak-roots/util/ids";
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

  static getPath(projectId) { return projectId }
  static splitPath(path) {
    const split = path.split("/");
    return { projectId: split[0] }
  }

  get id() { return this.projectId }
  set id(id) { this.pageId = id }
  get path() { return Project.getPath(this.projectId) }

  get parentIndex() { return this.oak.registry.projectIndex }
  get childIndex() { return this.sectionIndex }

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

  // Given a possible sectionId, modify it (minmally) to make sure it's unique within our sections
  uniquifySectionId(sectionId) {
    const sectionIds = this.sections.map( section => section.sectionId );
    return ids.uniquifyId(sectionId, sectionIds);
  }


  //////////////////////////////
  //  Initialization / Loading / Saving
  //////////////////////////////

  get route() { return this.oak.getPageRoute(this.projectId) }

  // Create the sectionIndex on demand
  _makeIndex() {
    return new LoadableIndex({
      useOneBasedNumbering: true,
      itemType: "section",
      indexProperties: {
        id: "id",
        title: "title"
      },
      loadData: () => {
        return api.loadSectionIndex(this.projectId);
      },
      createItem: (sectionId, props) => {
        return new Section({
          sectionId,
          projectId: this.projectId,
          ...props,
          oak: this.oak,
        });
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

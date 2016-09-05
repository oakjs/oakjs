//////////////////////////////
// Project class
//////////////////////////////

import ids from "oak-roots/util/ids";
import LoadableIndex from "oak-roots/LoadableIndex";
import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import api from "./api";
import ComponentController from "./ComponentController";
import oak from "./oak";
import Section from "./Section";

import ProjectComponent from "./components/Project";

export default class Project extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Project", ["projectId"]);
  }

  @proto
  type = "project";

  @proto
  ComponentSuperConstructor = ProjectComponent;

  //////////////////////////////
  //  ChildController stuff
  //////////////////////////////

  // Create the sectionIndex on demand
  _makeIndex() {
    return new LoadableIndex({
      itemType: "section",
      loadData: () => {
        return api.loadSectionIndex(this.projectId);
      },
      createItem: (sectionId, props) => {
        return new Section({
          sectionId,
          projectId: this.projectId,
          ...props,
        });
      }
    });
  }

  // map `projectId` to `id`
  get id() { return this.projectId }
  set id(id) { this.projectId = id }

  static splitPath(path) {
    const split = path.split("/");
    return { projectId: split[0] }
  }

  get parent() { return oak.account }

  getIndexData() { return { id: this.projectId, title: this.title } }

  get route() { return oak.getPageRoute(this.projectId) }


  //////////////////////////////
  //  Sections syntactic sugar
  //////////////////////////////

  get sectionIndex() { return this.childIndex }
  get sections() { return this.children }

  getSection(sectionIdentifier) {
    return this.sectionIndex.getItem(sectionIdentifier);
  }

  loadSection(sectionIdentifier) {
    return this.sectionIndex.loadItem(sectionIdentifier);
  }


  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return oak.getProjectTheme(this.projectId) }
  get component() { if (oak.project === this) return oak._projectComponent }

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

// Register it so `<Oak.Project>` elements in a jsxe will use `ProjectElement`.
import JSXParser from "./JSXParser";
JSXParser.registerType("Project", ProjectElement);
JSXParser.registerType("Oak-Project", ProjectElement);
JSXParser.registerType("Oak.Project", ProjectElement);

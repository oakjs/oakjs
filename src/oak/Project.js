//////////////////////////////
// Project[Controller] class
//////////////////////////////

import ids from "oak-roots/util/ids";
import LoadableIndex from "oak-roots/LoadableIndex";
import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import api from "./api";
import ComponentController from "./ComponentController";
import JSXElement from "./JSXElement";
import oak from "./oak";
import Section from "./Section";

import ProjectComponent from "./components/Project";

export default class Project extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Project", ["projectId"]);
  }

  @proto
  type = "Project";

  //////////////////////////////
  //  Account + Section syntactic sugar
  //////////////////////////////

  get sections() { return this.children }

  getSection(sectionId) { return this.getChild(sectionId) }
  loadSection(sectionId) { return this.loadChild(SectionId) }


  //////////////////////////////
  //  ChildController stuff
  //////////////////////////////

  // map `projectId` to `id`
  get id() { return this.projectId }
  set id(id) { this.projectId = id }

  get parent() { return this.account }
  get route() { return oak.getPageRoute(this.projectId) }

  // Create the index of Sections/Components on demand
  _makeIndex() {
    return new LoadableIndex({
      itemType: "section",
      loadData: () => {
        return api.loadSectionIndex(this.projectId);
      },
      createItem: (sectionId, props) => {
        // Create a Section or a generic ComponentController?
        const Constructor = (props.type === "Component" ? ComponentController : Section);
        return new Constructor({
          sectionId,
          projectId: this.projectId,
          ...props,
        });
      }
    });
  }


  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return oak.getProjectTheme(this.projectId) }

}

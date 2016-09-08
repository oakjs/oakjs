//////////////////////////////
// Project class
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

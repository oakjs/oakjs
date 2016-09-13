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
    dieIfMissing(this, "new Project", ["account", "projectId"]);
  }

  @proto
  type = "Project";

  //////////////////////////////
  //  Account + Section syntactic sugar
  //////////////////////////////

  getSection(sectionId) { return this.getChild(sectionId) }
  loadSection(sectionId) { return this.loadChild(SectionId) }


  //////////////////////////////
  //  ChildController stuff
  //////////////////////////////

  // map `projectId` to `id`
  get id() { return this.projectId }
  set id(id) { this.projectId = id }

  get parent() { return this.account }
  get route() { return this.account.getPageRoute(this.projectId) }

  // Create the index of Sections/Components on demand
  _makeChildIndex() {
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
          account: this.account,
          ...props,
        });
      },

      // Split loaded index into `items` (for sections) and `components`
// TODO: move this into a base class...
      onLoaded(jsonItems) {
        const items = LoadableIndex.prototype.onLoaded.call(this, jsonItems);
        this.items = items.filter(item => item instanceof Section);
        this.components = items.filter(item => !(item instanceof Section));
        return this.items;
      },

      // Save `items` and `components` in the same index.
      getIndexData() {
        return [
          ...this.items.map( item => item.getIndexData() ),
          ...this.components.map( component => component.getIndexData() )
        ];
      }
    });
  }


  //////////////////////////////
  //  Components
  //////////////////////////////

  // Get a project component specified by name.
  getComponent(id) { return this.childIndex.getItem(id) }

  // Load a project component specified by name
  loadComponent(id) { return this.childIndex.loadItem(id) }

  // TODO: dynamic components
  get components() { return oak.getProjectTheme(this.projectId) }

}

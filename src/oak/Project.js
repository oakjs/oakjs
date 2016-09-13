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

  @proto
  ComponentConstructor = ProjectComponent;

  //////////////////////////////
  //  Account + Section syntactic sugar
  //////////////////////////////

  getSection(sectionId) { return this.getChild(sectionId) }
  loadSection(sectionId) { return this.loadChild(SectionId) }


  //////////////////////////////
  //  ChildController stuff
  //////////////////////////////

  // We only think of our `sections` as `children`.
  // This ignores our `components`.
  get children() {
    return this.childIndex
        && this.childIndex.items.filter(item => item instanceof Section)
  }

  // map `projectId` to `id`
  get id() { return this.projectId }
  set id(id) { this.projectId = id }

  get parent() { return this.account }
  get route() { return this.account.getPageRoute(this.projectId) }

  // Create the index of Sections/Components on demand
  _makeChildIndex() {
    const project = this;

    return new LoadableIndex({
// DEPRECATE?  `defaultItemConstructor`??
      itemType: "section",

      loadData: () => {
        return api.loadControllerIndex(this);
      },

// TODO: genericise all of this...
      createItem: (id, props) => {
        // Create a Section or a generic ComponentController?
        const Constructor = (props.type === "Component" ? ComponentController : Section);
        const item = new Constructor({
          id,
          projectId: this.projectId,
          account: this.account,
          ...props,
        });

        // Set some getter for generic ComponentControllers.
        // This makes loading/etc work.
        if (Constructor === ComponentController) {
          Object.defineProperties(item, {
            parent: {
              get: () => this.account.getProject(this.projectId)
            }
          });
        }

        return item;
      },

      // Pull non-section `components` out into a map of getters
      //  for `project.components` to consume.
      onLoaded(jsonItems) {
        const items = LoadableIndex.prototype.onLoaded.call(this, jsonItems);
        const getters = project._componentGetters = {};
        items.filter( item => item.constructor === ComponentController)
          .forEach( component => {
            getters[component.id] = { get: function() { return component.Component } };
          });
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
  get components() {
    const base = oak.getProjectTheme(this.projectId);
    return Object.create(base, this._componentGetters);
  }

}

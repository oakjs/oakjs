//////////////////////////////
// Section class
//////////////////////////////

import ids from "oak-roots/util/ids";
import LoadableIndex from "oak-roots/LoadableIndex";
import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import api from "./api";
import ComponentController from "./ComponentController";
import JSXElement from "./JSXElement";
import oak from "./oak";
import Page from "./Page";

import SectionComponent from "./components/Section";

export default class Section extends ComponentController {
  constructor(props) {
    super(props);
    dieIfMissing(this, "new Section", ["sectionId", "projectId"]);
  }

  @proto
  type = "Section";

  //////////////////////////////
  //  Standard Component Identity stuff
  //////////////////////////////

  static splitPath(path) {
    const split = path.split("/");
    return { projectId: split[0], sectionId: split[1] }
  }

  get id() { return this.sectionId }
  set id(id) { this.sectionId = id }

  get parent() { return this.project }
  get parentIndex() { return this.project.childIndex }
  get childIndex() { return this.pageIndex }
  get children() { return this.pages }

  get route() { return oak.getPageRoute(this.projectId, this.sectionId) }

  //////////////////////////////
  //  Syntactic sugar
  //////////////////////////////

  get project() { return oak.account.getProject(this.projectId) }
  get pageIds() { return this.childIds }

  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return this.project.components }

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

  // Create the pageIndex on demand.
  _makeIndex() {
    return new LoadableIndex({
      itemType: "page",
      loadData: () => {
        return api.loadPageIndex(this.path);
      },
      createItem: (pageId, props) => {
        // Create a Page or a generic ComponentController?
        const Constructor = (props.type === "Component" ? ComponentController : Page);
        return new Constructor({
          pageId,
          sectionId: this.sectionId,
          projectId: this.projectId,
          ...props,
        });
      }
    });
  }
}


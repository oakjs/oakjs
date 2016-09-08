//////////////////////////////
// Page class
//////////////////////////////

import { proto, debounce   } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";

import ComponentController from "./ComponentController";
import JSXElement from "./JSXElement";
import oak from "./oak";

import PageComponent from "./components/Page";

export default class Page extends ComponentController {
  constructor(props) {
    dieIfMissing(props, "new Page", ["pageId", "sectionId", "projectId"]);
    super(props);
  }

  //////////////////////////////
  //  ChildController stuff
  //////////////////////////////

  // No child index.
  _makeIndex() { return undefined }

  static splitPath(path) {
    const split = path.split("/");
    return { projectId: split[0], sectionId: split[1], pageId: split[2] }
  }

  get id() { return this.pageId }
  set id(id) { this.pageId = id }

  get parent() { return this.section }
  get parentIndex() { return this.section.childIndex }

  get route() { return oak.getPageRoute(this.projectId, this.sectionId, this.pageId) }

  //////////////////////////////
  //  Syntactic sugar
  //////////////////////////////

  get project() { return oak.account.getProject(this.projectId) }
  get section() { return oak.account.getSection(this.projectId, this.sectionId) }


  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return this.section.components }

  // REFACTOR: rename this?
  get component() { if (oak.page === this) return oak._pageComponent }


  //////////////////////////////
  //  Data manipulation
  //////////////////////////////

  get data() {
    const component = this.component;
    if (component) return component.data;
  }

  // Get page `data` at path
  get(path, defaultValue){
    const component = this.component;
    if (component) return component.get(path, defaultValue);
  }

  // Get page `data` at path
  set(path, value){
    const component = this.component;
    if (component) return component.set(path, value);
  }

  deferredSet(path, value) {
    return () => this.set(path, value);
  }

}


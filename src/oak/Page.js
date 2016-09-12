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

  @proto
  type = "Page";


  //////////////////////////////
  //  Project + Page Syntactic sugar
  //////////////////////////////

  get section() { return this.parent }
  get project() { return this.section.project }


  //////////////////////////////
  //  ChildController stuff
  //////////////////////////////

  // Map `id` to `sectionId`
  get id() { return this.pageId }
  set id(id) { this.pageId = id }

  get parent() { return this.account.getSection(this.projectId, this.sectionId) }
  get route() { return oak.getPageRoute(this.projectId, this.sectionId, this.pageId) }

  static splitPath(path) {
    const split = path.split("/");
    return { projectId: split[0], sectionId: split[1], pageId: split[2] }
  }


  //////////////////////////////
  //  Components
  //////////////////////////////

  // TODO: dynamic components
  get components() { return this.section.components }


  //////////////////////////////
  //  Data manipulation
  //////////////////////////////

//DEPRECATED... ???
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


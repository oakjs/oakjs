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
    dieIfMissing(props, "new Page", ["account", "pageId", "sectionId", "projectId"]);
    super(props);
  }

  @proto
  type = "Page";

  @proto
  ComponentConstructor = PageComponent;


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
  get route() { return this.account.getPageRoute(this.projectId, this.sectionId, this.pageId) }

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


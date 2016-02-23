//////////////////////////////
//
//  ProjectIndex class
//
//  Index of all known projects.
//
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentIndex from "./ComponentIndex";
import ProjectController from "./ProjectController";

export default class ProjectIndex extends ComponentIndex {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app"]);
  }

  // Syntactic sugar for `loadComponent`
  loadProject(...args) {
    return this.loadComponent(...args);
  }

  _makeComponent(projectId, props) {
    return new ProjectController({
      app: this.app,
      props: {
        project: projectId,
        ...props
      }
    });
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.loadProjectIndex(this)
    .then(index => {
      this.mutate({ index });
      return this;
    });
  }

  saveData() {
    return api.saveProjectIndex(this)
  }


}

//////////////////////////////
//
//  StackIndex:  Index of stacks in a project.
//
//////////////////////////////

import objectUtil from "oak-roots/util/object";

import api from "./api";
import ComponentIndex from "./ComponentIndex";
import StackController from "./StackController";

export default class StackIndex extends ComponentIndex {
  constructor(...args) {
    super(...args);
    objectUtil.dieIfMissing(this, ["app", "project", "path"]);
  }

  // Syntactic sugar for `loadComponent`
  loadStack(...args) {
    return this.loadComponent(...args);
  }

  _makeComponent(stackId, props) {
    return new StackController({
      app: this.app,
      project: this.project,
      props: {
        project: this.project.id,
        stack: stackId,
        ...props
      }
    });
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.loadStackIndex(this)
    .then(index => {
      this.mutate({ index });
      return this;
    });
  }

  saveData() {
    return api.saveStackIndex(this)
  }

}

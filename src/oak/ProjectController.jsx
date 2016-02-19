//////////////////////////////
// ProjectController class
//////////////////////////////

import React from "react";

import Project from "./Project";
import JSXElement from "./JSXElement";
import OakController from "./OakController";
import Stub from "./components/Stub";

class ProjectController extends OakController {

  //////////////////////////////
  //  Identity
  //////////////////////////////

  get type() { return "project" }
  get baseComponentConstructor() { return Project }

  get id() { return `${this.projectId}` }
  get path() { return `${this.projectId}` }

// TODO: this.parent.rootSelector + ...
  get rootSelector() { return `.oak.Project#${this.projectId}` }

  get projectId() { return this.attributes && this.attributes.project }

  dieIfNotIdentified(errorMessage) {
    this.dieIfMissing(["projectId"], errorMessage);
  }


  //////////////////////////////
  //  Mutation
  //////////////////////////////


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    super.loadData();
    return Promise.all([this.loadChildIndex(), this.loadComponent(), this.loadStyle(), this.loadScript()])
      .then(([childIndex, component, style, script]) => {
        return { childIndex, component, style, script }
      });
  }

  saveData() {
    super.saveData();
    return Promise.all([this.saveChildIndex(), this.saveComponent(), this.saveStyle(), this.saveScript()]);
  }

}

export default ProjectController;

//////////////////////////////
// CardController class
//////////////////////////////

import React from "react";

import Card from "./Card";
import JSXElement from "./JSXElement";
import OakController from "./OakController";
import Stub from "./components/Stub";

class CardController extends OakController {

  //////////////////////////////
  //  Identify
  //////////////////////////////

  // TODO: these are really prototype defaults...
  get type() { return "card" }
  get baseComponentConstructor() { return Card }

  get id() { return `${this.projectId}-${this.stackId}-${this.cardId}` }
  get path() { return `${this.projectId}/${this.stackId}/${this.cardId}` }

// TODO: this.parent.rootSelector + ...
  get rootSelector() { return `.oak.Project#${this.projectId} .oak.Stack#${this.stackId} .oak.Card#${this.cardId}` }

  get cardId() { return this.attributes && this.attributes.card }
  get stackId() { return this.attributes && this.attributes.stack }
  get projectId() { return this.attributes && this.attributes.project }

  dieIfNotIdentified(errorMessage) {
    this.dieIfMissing(["cardId", "stackId", "projectId"], errorMessage);
  }

  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    super.loadData();
    return Promise.all([this.loadComponent(), this.loadStyle(), this.loadScript()])
      .then(([component, style, script]) => {
        return { component, style, script }
      });
  }

  saveData() {
    super.saveData();
    return Promise.all([this.saveComponent(), this.saveStyle(), this.saveScript()]);
  }

}

export default CardController;

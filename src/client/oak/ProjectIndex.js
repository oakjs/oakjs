//////////////////////////////
//
//  ProjectIndex class
//
//  Index of all known projects.
//  Use this class as a factory to get access to Project, Stack and CardControllers.
//
//////////////////////////////

import Loadable from "oak-roots/Loadable";
import Mutable from "oak-roots/Mutable";
import Savable from "oak-roots/Savable";

import api from "./api";
import ProjectController from "./ProjectController";
import StackController from "./StackController";
import CardController from "./CardController";

export default class ProjectIndex extends Savable(Loadable(Mutable)) {
  constructor() {
    super(...args);
    this.__REGISTRY__ = {};
  }

  //////////////////////////////
  //
  //  Registry
  //
  //////////////////////////////

  // Registry of instantiated controllers
  _getFromRegistry(...path) {
    return this.__REGISTRY__[path.join("/")];
  }
  _addToRegistry(thing, ...path) {
    if (!thing || typeof thing !== "object") {
      throw new TypeError("projectIndex._addToRegistry("+thing+",",path,"): thing to add must be an object");
    }
    if (!path.length || !path.every(step => typeof step === "string")) {
      throw new TypeError("projectIndex._addToRegistry("+thing+",",path,"): path must be strings!");
    }
    return (this.__REGISTRY__[path.join("/")] = thing);
  }

  //////////////////////////////
  //  Get projects!
  //////////////////////////////

  // Given a project id or index, return the `project.id`
  //  but only if the project is known to us!
  // NOTE: always returns `undefined` if we haven't loaded yet.
  getProjectId(projectIdentifier) {
    if (this.projects) {
      switch (typeof projectIdentifier) {
        case "string":
          return (this.projects[projectIdentifier] ? projectIdentifier : undefined);
        case "number":
          return Object.keys(this.projects)[projectIdentifier];
        default:
          console.error(`projectIndex.getProjectId(${projectIdentifier}): project identifier type not understood`);
      }
    }
    return undefined;
  }

  // Return a project directly, but only if it's alerady been loaded.
  // You can pass a string id or a numeric index.
  getProject(projectIdentifier) {
    const projectId = this.getProjectId(projectIdentifier);
    return this._getFromRegistry("PROJECT", projectId);
  }

  // Load a project specified by id or index.
  // Returns a promise which resolves with the loaded project.
  loadProject(projectIdentifier) {
    const project = this.getProject(projectIdentifier);
    if (project) return Promise.resolve(project);

    return this.load()
      .then( () => {
        const projectId = this.getProjectId(projectIdentifier);

        // Bail if we can't find the project in the index
        if (!projectId) {
          throw new ReferenceError(`Project '${projectIdentifier}' not found`);
        }

        let project = this._getFromRegistry("PROJECT", projectId);
        if (!project) {
          project = new ProjectController({ props: { project: projectId } });
          this._addToRegistry(project, "PROJECT", projectId);
        }
        return project.load();
      });
  }


  //////////////////////////////
  //  Get stacks!
  //////////////////////////////

  // Given a project + stack (id or index), return the stackId
  //  but only if the project and stack are known to us!
  //
  // NOTE: always returns `undefined` if we haven't loaded yet.
  getStackId(projectIdentifier, stackIdentifier) {
    const project = this.getProject(projectIdentifier);
    if (project) return project.getStackId(stackIdentifier);
    return undefined;
  }

  // Return a stack directly, but only if it's alerady been loaded.
  // You can pass a string ids or numeric indexes.
  getStack(projectIdentifier, stackIdentifier) {
    const projectId = this.getProjectId(projectIdentifier);
    const stackId = this.getStackId(projectId, stackIdentifier);
    return this._getFromRegistry("STACK", projectId, stackId);
  }

  // Load a stack specified by ids and/or indexes.
  // Returns a promise which resolves with the loaded stack.
  loadStack(projectIdentifier, stackIdentifier) {
    const stack = this.getStack(projectIdentifier, stackIdentifier);
    if (stack) return Promise.resolve(stack);

    return this.loadProject(projectIdentifier)
      .then( project => {
        const projectId = project.id;
        const stackId = project.getStackId(stackIdentifier);

        // Bail if we can't find the stack in the index
        if (!stackId) {
          throw new ReferenceError(`Stack '${stackIdentifier}' not found`);
        }

        let stack = this._getFromRegistry("STACK", projectId, stackId);
        if (!stack) {
          stack = new StackController({ props: { project: projectId, stack: stackId } });
          this._addToRegistry(stack, "STACK", projectId, stackId);
        }

        stack.project = project;

        return stack.load();
      });
  }

  //////////////////////////////
  //  Get cards!
  //////////////////////////////

  // Given a project + stack + card (id or index), return the cardId
  //  but only if the project and stack are known to us!
  //
  // NOTE: always returns `undefined` if we haven't loaded yet.
  getCardId(projectIdentifier, stackIdentifier, cardIdentifier) {
    const stack = this.getStack(projectIdentifier, stackIdentifier);
    if (stack) return stack.getCardId(cardIdentifier);
    return undefined;
  }

  // Return a card directly, but only if it's already been loaded.
  getCard(projectIdentifier, stackIdentifier, cardIdentifier) {
    const projectId = this.getProjectId(projectIdentifier);
    const stackId = this.getStackId(projectId, stackIdentifier);
    const cardId = this.getCardId(projectId, stackId, cardIdentifier);
    return this._getFromRegistry("CARD", projectId, stackId, cardId);
  }

  // Load a card specified by ids and/or indexes.
  // Returns a promise which resolves with the loaded card.
  loadCard(projectIdentifier, stackIdentifier, cardIdentifier) {
    const card = this.getCard(projectIdentifier, stackIdentifier, cardIdentifier);
    if (card) return Promise.resolve(card);

    return this.loadStack(projectIdentifier, stackIdentifier)
      .then( stack => {
        const project = stack.project;
        const projectId = project.id;
        const stackId = stack.id;
        const cardId = stack.getCardId(cardIdentifier);
        // Bail if we can't find the card in the index
        if (!cardId) {
          throw new ReferenceError(`Card '${projectId}/${stackId}/${cardIdentifier}' not found`);
        }

        let card = this._getFromRegistry("CARD", projectId, stackId, cardId);
        if (!card) {
          card = new CardController({ props: { project: projectId, stack: stackId, card: cardId } });
          this._addToRegistry(card, "CARD", projectId, stackId, cardId);
        }

        card.project = project;
        card.stack = stack;
        return card.load();
      });
  }

  //////////////////////////////
  //  Change handling
  //////////////////////////////

  onChanged(changes, old) {
    super.onChanged(changes, old);
    // If any of our special bits changes, notify.
    // NOTE: we don't notify on the initial load!  (???)
    if (changes.projects && old.projects) this.onProjectsChanged(changes.projects, old.projects);
  }

  onProjectsChanged(newProjects, oldProjects) {
    console.info("ProjectIndex changed");
    this.trigger("projectsChanged", newProjects, oldProjects);
  }


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
      projects: api.loadProjectIndex(this)
    })
    .then(data => {
      this.mutate(data);
      return this;
    });
  }

  unload() {
    this.mutate({ projects: undefined });
    super.unload();
  }

  saveData() {
    console.error("TODO: implement projectIndex.saveData()");
  }


}

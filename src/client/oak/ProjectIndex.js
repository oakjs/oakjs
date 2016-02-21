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

  //////////////////////////////
  //
  //  Get ProjectControllers, StackControllers and CardControllers as singletons
  //
  //  These routines return a PROMISE which yields a controller for the above.
  //  The same set of inputs will always return the same set of outputs.
  //
  //////////////////////////////

  // Registry of instantiated controllers
  get _registry() {
    if (!this.hasOwnProperty("__REGISTRY__")) {
      this.__REGISTRY__ = {
        projects: {},
        stacks: {},
        cards: {}
      }
    }
    return this.__REGISTRY__;
  }

  getProject(project) {
    return this.load()
      .then( () => {
        // handle project specified as number or id
        const projectId = typeof project === "number"
                        ? Object.keys(this.index)[project]
                        : project;

        // Bail if we can't find the project in the index
        if (!this.index[projectId]) {
          throw new ReferenceError(`Project '${project}' not found`);
        }

        const registry = this._registry;
        if (!registry.projects[projectId]) {
          registry.projects[projectId] = new ProjectController({ props: { project: projectId } });
        }
window._project = registry.projects[projectId];
        return { project: registry.projects[projectId] };
      });
  }

  getStack(project, stack) {
    return this.getProject(project)
      .then( { project } => project.load() )
      .then( project => {
        const projectId = project.projectId;
        // handle stack specified as number or id
        const stackId = typeof stack === "number"
                        ? Object.keys(project.index)[stack]
                        : stack;

        // Bail if we can't find the stack in the index
        if (!project.index[stackId]) {
          throw new ReferenceError(`Project '${stack}' not found`);
        }

        const stackPath = project.projectId + "-" + stackId;
        const registry = this._registry;
        if (!registry.stacks[stackPath]) {
          registry.stacks[stackPath] = new StackController({ props: { project: projectId, stack: stackId } });
        }
window._stack = registry.stacks[stackPath];
        return { project, stack: registry.stacks[stackPath] };
      });
  }

  getCard(project, stack, card) {
    return this.getStack(project, stack)
      .then( { project, stack } => stack.load().then( () => { project, stack } )
      .then( { project, stack } => {
        const projectId = project.projectId;
        const stackId = stack.stackId;
        // handle card specified as number or id
        const cardId = typeof card === "number"
                        ? Object.keys(stack.index)[card]
                        : card;

        // Bail if we can't find the card in the index
        if (!stack.index[cardId]) {
          throw new ReferenceError(`stack '${card}' not found`);
        }

        const cardPath = project.projectId + "-" + stack.stackId + "-" + cardId;
        const registry = this._registry;
        if (!registry.cards[cardPath]) {
          registry.cards[cardPath] = new CardController({ props: { project: projectId, stack: stackId, card: cardId } });
        }
window._card = registry.cards[cardPath];
        return { project, stack, card: registry.cards[cardPath] };
      });
  }

  //////////////////////////////
  //  Change handling
  //////////////////////////////

  onChanged(changes, old) {
    super.onChanged(changes, old);
    // If any of our special bits changes, notify.
    // NOTE: we don't notify on the initial load!  (???)
    if (changes.index && old.index) this.onIndexChanged(changes.index, old.index);
  }

  onIndexChanged(newIndex, oldIndex) {
    console.info("ProjectIndex changed");
    this.trigger("indexChanged", newIndex, oldIndex);
  }


  //////////////////////////////
  //  Loading / Saving
  //////////////////////////////

  loadData() {
    return api.map({
      index: api.loadProjectIndex(this)
    });
  }

  unload() {
    this.mutate({ index: undefined });
    super.unload();
  }

  // Save our data when we change.
  onLoaded(data) {
    this.mutate(data);
  }

  saveData() {
    console.error("TODO: implement projectIndex.saveData()");
  }


}

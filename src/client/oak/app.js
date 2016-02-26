//REFACTOR:  app.projectIndex is less confusing

//////////////////////////////
//
//  App singleton for oak editor app
//
//  TODO: instantiation pattern?
//////////////////////////////
import Registry from "oak-roots/Registry";
import global from "oak-roots/util/global";


import ComponentIndex from "./ComponentIndex";
import ProjectController from "./ProjectController";

import SUIComponents from "themes/SUI/components";
import oakComponents from "./components";

let app;

class App {
  constructor() {
    // There can be only one!
    if (global.app) {
      const message = "Second instance of `app` created.  BAD!!!";
      console.error(message);
      throw new ReferenceError(message);
    }

    this.projectIndex = new ComponentIndex({ controller: this, type: "app" });
    // go ahead and load the project index..
    this.projectIndex.load();
  }

  //////////////////////////////
  //  Components
  //////////////////////////////

  // All app components
  // TODO: this should really be dynamic...
  components = Object.assign({}, SUIComponents, oakComponents)

  __PROJECT_THEMES__ = {};
  setProjectTheme(projectId, components) {
    this.__PROJECT_THEMES__[projectId] = components;
  }

  getProjectTheme(projectId) {
    return this.__PROJECT_THEMES__[projectId] || this.components;
  }

  //////////////////////////////
  //  Projects!
  //////////////////////////////

  // Return a project, but only if it has already been loaded.
  // Returns `undefined` if the project is not found or it hasn't been loaded yet.
  // Use `app.loadProject()` if you want to ensure that a project is loaded.
  getProject(projectIdentifier) {
    return this.projectIndex.get(projectIdentifier);
  }

  // Return a promise which resolves with a loaded project.
  // If project is not found, the promise will reject.
  // You can specify string id or numeric index.
  loadProject(projectIdentifier) {
    return this.projectIndex.loadComponent(projectIdentifier)
      .catch(error => {
        console.group(`Error loading project ${projectIdentifier}:`);
        console.error(error);
        console.groupEnd();
        throw new ReferenceError("Couldn't load project");
      });
  }

// REFACTOR:  Pass this method in to the projectIndex.loadComponent
  // Create a project with the given specs.
  _makeChildComponent(index, projectId, props) {
    return new ProjectController({
      app: this,
      props: {
        project: projectId,
        ...props
      }
    });
  }

  //////////////////////////////
  //  Stacks!
  //////////////////////////////

  getStack(projectIdentifier, stackIdentifier) {
    const project = this.getProject(projectIdentifier);
    if (project) return project.getStack(stackIdentifier);
  }

  loadStack(projectIdentifier, stackIdentifier) {
    const stack = this.getStack(projectIdentifier, stackIdentifier);
    if (stack) return Promise.resolve(stack);

    return this.loadProject(projectIdentifier)
      .then( project => {
        return project.loadStack(stackIdentifier);
      })
      .catch(error => {
        console.group(`Error loading stack ${projectIdentifier}/${stackIdentifier}:`);
        console.error(error);
        console.groupEnd();
        throw new ReferenceError("Couldn't load stack");
      });
  }


  //////////////////////////////
  //  Cards!
  //////////////////////////////

  getCard(projectIdentifier, stackIdentifier, cardIdentifier) {
    const stack = this.getStack(projectIdentifier, stackIdentifier);
    if (stack) return stack.getCard(cardIdentifier);
  }

  loadCard(projectIdentifier, stackIdentifier, cardIdentifier) {
    const card = this.getCard(projectIdentifier, stackIdentifier, cardIdentifier);
    if (card) return Promise.resolve(card);

    return this.loadStack(projectIdentifier, stackIdentifier)
      .then( stack => {
        return stack.loadCard(cardIdentifier);
      })
      .catch(error => {
        console.group(`Error loading card ${projectIdentifier}/${stackIdentifier}/${cardIdentifier}:`);
        console.error(error);
        console.groupEnd();
        throw new ReferenceError("Couldn't load card");
      });
  }

  getCardRoute(projectId, stackId = 0, cardId = 0) {
    return `/project/${projectId}/${stackId}/${cardId}`;
  }

}

// Create an instance and export it
app = new App();
export default app;

// globalize for reflection
global.app = app;

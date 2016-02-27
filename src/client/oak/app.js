//////////////////////////////
//
//  App singleton for oak editor app
//
//  TODO: instantiation pattern?
//////////////////////////////

import global from "oak-roots/util/global";
import LoadableIndex from "oak-roots/LoadableIndex";


import api from "./api";
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

    this.initializeProjectIndex();
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

  getComponent(type, errorMessage, components = this.components) {
    // return non-string component immediately
    if (type && typeof type !== "string") return type;

    if (typeof type === "string") {
      // if all lower case, it's an HTML element -- just return it
      if (type.toLowerCase() === type) return type;

      // return it if we can find it in our `components`
      if (components[type]) return components[type];
    }
    // log an error if they gave us an errorMessage
    if (errorMessage) console.error(`${errorMessage}: type = '${type}'`);

    return undefined;
  }

  //////////////////////////////
  //  Projects!
  //////////////////////////////

  initializeProjectIndex() {
    this.projectIndex = new LoadableIndex({
      itemType: "project",
      loadIndex: () => {
        return api.loadProjectIndex(this);
      },
      createChild: (projectId, props) => {
        return new ProjectController({
          props: {
            project: projectId,
            ...props
          },
          app: this,
        });
      },
    });

    // go ahead and load the project index..
    this.projectIndex.load();
  }

  // Return a project, but only if it has already been loaded.
  // Returns `undefined` if the project is not found or it hasn't been loaded yet.
  // Use `app.loadProject()` if you want to ensure that a project is loaded.
  getProject(projectIdentifier) {
    return this.projectIndex.getItem(projectIdentifier);
  }

  // Return a promise which resolves with a loaded project.
  // If project is not found, the promise will reject.
  // You can specify string id or numeric index.
  loadProject(projectIdentifier) {
    return this.projectIndex.loadItem(projectIdentifier)
      .catch(error => {
        console.group(`Error loading project ${projectIdentifier}:`);
        console.error(error);
        console.groupEnd();
        throw new ReferenceError("Couldn't load project");
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

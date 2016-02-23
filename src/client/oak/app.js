//////////////////////////////
//
//  App singleton for oak editor app
//
//  TODO: instantiation pattern?
//////////////////////////////
import Registry from "oak-roots/Registry";
import global from "oak-roots/util/global";

import SUIComponents from "themes/SUI/components";

import ComponentIndex from "./ComponentIndex";
import oakComponents from "./components";
import ProjectController from "./ProjectController";

let app;

class App {
  constructor() {
    // There can be only one!
    if (global.app) {
      const message = "Second instance of `app` created.  BAD!!!";
      console.error(message);
      throw new ReferenceError(message);
    }

    this.projects = new ComponentIndex({ controller: this, type: "app" });
    // go ahead and load the project index..
    this.projects.load();
  }

  //////////////////////////////
  //  Components
  //////////////////////////////

  // All app components
  // TODO: this should really be dynamic...
  static components = Object.assign({}, SUIComponents, oakComponents)
  get components() { return this.constructor.components }

  getComponent(controller, type, errorMessage) {
    // return non-string component immediately
    if (type && typeof type !== "string") return type;

    if (typeof type === "string") {
      // if all lower case, it's an HTML element -- just return it
      if (type.toLowerCase() === type) return type;

      // look in controller components
      if (controller && controller.components && controller.components[type]) {
        return controller.components[type];
      }
      // look in our components
      if (this.components[type]) return this.components[type];
    }
    // log an error if they gave us an errorMessage
    if (errorMessage) console.error(`${errorMessage}: type = '${type}'`);
  }

  //////////////////////////////
  //  Projects!
  //////////////////////////////

  // Return a project, but only if it has already been loaded.
  // Returns `undefined` if the project is not found or it hasn't been loaded yet.
  // Use `app.loadProject()` if you want to ensure that a project is loaded.
  getProject(projectIdentifier) {
    return this.projects.get(projectIdentifier);
  }

  // Return a promise which resolves with a loaded project.
  // If project is not found, the promise will reject.
  // You can specify string id or numeric index.
  loadProject(projectIdentifier) {
    return this.projects.loadComponent(projectIdentifier)
      .catch(error => {
        console.group(`Error loading project ${projectIdentifier}:`);
        console.error(error);
        console.groupEnd();
        throw new ReferenceError("Couldn't load project");
      });
  }

  // Create a project with the given specs.
  _makeComponent(index, projectId, props) {
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


}

// Create an instance and export it
app = new App();
export default app;

// globalize for reflection
global.app = app;

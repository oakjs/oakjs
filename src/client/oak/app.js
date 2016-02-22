//////////////////////////////
//
//  App singleton for oak editor app
//
//  TODO: instantiation pattern?
//////////////////////////////

import ProjectIndex from "./ProjectIndex";

import global from "oak-roots/util/global";

let app;

class App {
  constructor() {
    // There can be only one!
    if (global.app) {
      const message = "Second instance of `app` created.  BAD!!!";
      console.error(message);
      throw new ReferenceError(message);
    }

    this.projects = new ProjectIndex();
    // go ahead and load the project index..
    this.projects.load();
  }

  //////////////////////////////
  //  Projects!
  //////////////////////////////

  // Return a project, but only if it has already been loaded.
  // Returns `undefined` if the project is not found or it hasn't been loaded yet.
  // Use `app.loadProject()` if you want to ensure that a project is loaded.
  getProject(projectId) {
    return app.projects.getProject(projectId);
  }

  // Return a promise which resolves with a loaded project.
  // If project is not found, the promise will reject.
  // You can specify string ids or numeric ids.
  loadProject(projectId) {
    return app.projects.loadProject(projectId)
      .catch(error => {
        console.group(`Error loading ${projectId}:`);
        console.error(error);
        console.groupEnd();
        throw new ReferenceError("Couldn't load project");
      });
  }


  //////////////////////////////
  //  Stacks!
  //////////////////////////////

  // Return a stack, but only if it has already been loaded.
  // Returns `undefined` if the stack is not found or it hasn't been loaded yet.
  // Use `app.loadStack()` if you want to ensure that a stack is loaded.
  getStack(projectId, stackId) {
    return app.projects.getStack(projectId, stackId);
  }

  // Return a promise which resolves with a loaded stack.
  // If stack is not found, the promise will reject.
  // You can specify string ids or numeric ids.
  loadStack(projectId, stackId) {
    return app.projects.loadStack(projectId, stackId)
      .catch(error => {
        console.group(`Error loading ${projectId}/${stackId}:`);
        console.error(error);
        console.groupEnd();
        throw new ReferenceError("Couldn't load stack");
      });
  }

  //////////////////////////////
  //  Cards!
  //////////////////////////////

  // Return a card, but only if it has already been loaded.
  // Returns `undefined` if the card is not found or it hasn't been loaded yet.
  // Use `app.loadCard()` if you want to ensure that a card is loaded.
  getCard(projectId, stackId, cardId) {
    return app.projects.getCard(projectId, stackId, cardId);
  }

  // Return a promise which resolves with a loaded card.
  // If card is not found, the promise will reject.
  // You can specify string ids or numeric ids.
  loadCard(projectId, stackId, cardId) {
    return app.projects.loadCard(projectId, stackId, cardId)
      .catch(error => {
        console.group(`Error loading ${projectId}/${stackId}/${cardId}:`);
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

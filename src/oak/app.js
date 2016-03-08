//////////////////////////////
//
//  App singleton for oak editor app
//
//  TODO: instantiation pattern?
//////////////////////////////

import global from "oak-roots/util/global";
import LoadableIndex from "oak-roots/LoadableIndex";
import Registry from "oak-roots/Registry";
import UndoQueue from "oak-roots/UndoQueue";

import actions from "./actions";
import api from "./api";
import Card from "./Card";
import Project from "./Project";
import Stack from "./Stack";
import ComponentLoader from "./ComponentLoader";

import OakCard from "./components/OakCard";
import OakProject from "./components/OakProject";
import OakStack from "./components/OakStack";

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

    this.registry = new Registry();

    this.undoQueue = new UndoQueue();

    // load the project index to start with since that's the first thing we'll need
    this.projectIndex.load();

    // HACK
    this.state = {
      editing: true
    }

  }

  //////////////////////////////
  //  Routing
  //////////////////////////////

  goTo(route, replace) {
    if (!app.router) throw new TypeError(`app.goTo(${route}): app.router is not set`);

    if (replace || app.router.isActive(route)) {
      app.router.replace(route);
    }
    else {
      app.router.push(route);
    }
  }

  // Return URL for card, stack or project
  getCardRoute(projectId, stackId = 0, cardId = 0) {
    return `/project/${projectId}/${stackId}/${cardId}`;
  }

  //////////////////////////////
  //  Components
  //////////////////////////////

  // All app components
  // TODO: this should really be dynamic...
  components = Object.assign({}, SUIComponents, oakComponents)

  static __PROJECT_THEMES__ = {};
  setProjectTheme(projectId, components) {
    this.constructor.__PROJECT_THEMES__[projectId] = components;
  }

  getProjectTheme(projectId) {
    return this.constructor.__PROJECT_THEMES__[projectId] || this.components;
  }

  getComponentForType(type, errorMessage, components = this.components) {
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

  get projectIndex() { return this.getProjectIndex() }
  get projects() { return this.projectIndex.items }
  get projectIds() { return this.projectIndex.itemIds }
  get projectMap() { return this.projectIndex.itemMap }

  showProject(projectIdentifier) {
    const route = this.getCardRoute(projectIdentifier);
    app.goTo(route);
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

  showStack(projectIdentifier, stackIdentifier) {
    const route = this.getCardRoute(projectIdentifier, stackIdentifier);
    app.goTo(route);
  }

  getStack(projectIdentifier, stackIdentifier) {
    const project = this.getProject(projectIdentifier);
    if (project) return project.getStack(stackIdentifier);
  }

  loadStack(projectIdentifier, stackIdentifier) {
    const stack = this.getStack(projectIdentifier, stackIdentifier);
    if (stack) return stack.load();

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

  showCard(projectIdentifier, stackIdentifier, cardIdentifier) {
    const route = this.getCardRoute(projectIdentifier, stackIdentifier, cardIdentifier);
    app.goTo(route);
  }

  getCard(projectIdentifier, stackIdentifier, cardIdentifier) {
    const stack = this.getStack(projectIdentifier, stackIdentifier);
    if (stack) return stack.getCard(cardIdentifier);
  }

  loadCard(projectIdentifier, stackIdentifier, cardIdentifier) {
    const card = this.getCard(projectIdentifier, stackIdentifier, cardIdentifier);
    if (card) return card.load();

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




  //////////////////////////////
  //  Indexes
  //////////////////////////////

  _getFromRegistry(typePrefix, pathOrController, creatorFunction) {
    const registryPath = typePrefix + (typeof pathOrController === "string" ? pathOrController : pathOrController.path);
    let item = this.registry.get(registryPath);
    if (!item && creatorFunction) {
      item = creatorFunction.call(this, pathOrController);
      item.app = this;
      item._registryPath = registryPath;
      this.registry.add(item, registryPath);
    }
    return item;
  }

  // Return the one and only project index singleton.
  getProjectIndex() {
    return this._getFromRegistry("PROJECTS:", "", this._makeProjectIndex);
  }

  // Create the project index on demand.
  // DO NOT CALL THIS!  Use `app.getProjectIndex()` instead.
  _makeProjectIndex() {
    return new LoadableIndex({
      itemType: "project",
      loadIndex: () => {
        return api.loadProjectIndex();
      },
      createItem: (projectId, props) => {
        return new Project({
          projectId,
          ...props,
          app: this,
        });
      },
    });
  }


  // Return the stack index singleton for a specific project.
  getStackIndex(projectPath) {
    return this._getFromRegistry("STACK-INDEX:", projectPath, this._makeStackIndex)
  }

  // Create a stack index on demand.
  // DO NOT CALL THIS!  Use `app.getStackIndex()` instead.
  _makeStackIndex(projectPath) {
    const projectId = projectPath;
    return new LoadableIndex({
      itemType: "stack",
      loadIndex: () => {
        return api.loadStackIndex(projectPath);
      },
      createItem: (stackId, props) => {
        return new Stack({
          stackId,
          projectId,
          ...props,
          app: this,
        });
      }
    });
  }


  // Return the card index singleton for a specific stack.
  getCardIndex(stackPath) {
    return this._getFromRegistry("CARD-INDEX:", stackPath, this._makeCardIndex)
  }

  // Create a card index on demand.
  // DO NOT CALL THIS!  Use `app.getCardIndex()` instead.
  _makeCardIndex(stackPath) {
    const [ projectId, stackId ] = stackPath.split("/");
    return new LoadableIndex({
      itemType: "card",
      loadIndex: () => {
        return api.loadCardIndex(stackPath);
      },
      createItem: (cardId, props) => {
        return new Card({
          cardId,
          stackId,
          projectId,
          ...props,
          app: this,
        });
      }
    });
  }


  //////////////////////////////
  //  Loaders
  //////////////////////////////

  getPath(pathOrController) {
    if (typeof pathOrController === "string") return pathOrController;
    if (pathOrController && pathOrController.path) return pathOrController.path;
    console.warn(`app.getPath(${controller}): cant figure out path`);
  }

  getLoader(pathOrController, makeIfNecessary) {
    if (pathOrController instanceof ComponentLoader) return pathOrController;

    const path = this.getPath(pathOrController);
    if (!path) return;
    const { projectId, stackId, cardId } = path.split("/");
    if (cardId) return app.getCardLoader(pathOrController, makeIfNecessary);
    if (stackId) return app.getStackLoader(pathOrController, makeIfNecessary);
    return app.getProjectLoader(pathOrController, makeIfNecessary);
  }

  // Return the singleton loader for some project.
  getProjectLoader(project, makeIfNecessary) {
    const makeLoader = makeIfNecessary && project instanceof Project && this._makeProjectLoader;
    return this._getFromRegistry("PROJECT-LOADER:", project, makeLoader);
  }

  // Create a project loader on demand.
  // DO NOT CALL THIS!  Use `app.getProjectLoader()` instead.
  _makeProjectLoader(project) {
    return new ComponentLoader({
      type: "Project",
      path: project.path,
      controller: project,
      SuperConstructor: OakProject
    });
  }

  // Return the singleton loader for some stack.
  getStackLoader(stack, makeIfNecessary) {
    const makeLoader = makeIfNecessary && stack instanceof Stack && this._makeStackLoader;
    return this._getFromRegistry("STACK-LOADER:", stack, makeLoader);
  }

  // Create a stack loader on demand.
  // DO NOT CALL THIS!  Use `app.getStackLoader()` instead.
  _makeStackLoader(stack) {
    return new ComponentLoader({
      type: "Stack",
      path: stack.path,
      controller: stack,
      SuperConstructor: OakStack
    });
  }

  // Return the singleton loader for some card.
  getCardLoader(card, makeIfNecessary) {
    const makeLoader = makeIfNecessary && card instanceof Card && this._makeCardLoader;
    return this._getFromRegistry("CARD-LOADER:", card, makeLoader);
  }

  // Create a card loader on demand.
  // DO NOT CALL THIS!  Use `app.getCardLoader()` instead.
  _makeCardLoader(card) {
    return new ComponentLoader({
      type: "Card",
      path: card.path,
      controller: card,
      SuperConstructor: OakCard
    });
  }

}

// Create an instance and export it
app = new App();
export default app;

// globalize for reflection
global.app = app;

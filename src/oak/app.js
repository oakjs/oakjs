//////////////////////////////
//
//  App singleton for oak editor app
//
//  TODO: instantiation pattern?
//////////////////////////////

import { debounce } from "oak-roots/util/decorators";
import elements from "oak-roots/util/elements";
import global from "oak-roots/util/global";
import LoadableIndex from "oak-roots/LoadableIndex";
import Registry from "oak-roots/Registry";
import UndoQueue from "oak-roots/UndoQueue";

import actions from "./actions";
import api from "./api";
import Card from "./Card";
import OakEvent from "./OakEvent";
import Project from "./Project";
import Section from "./Section";
import ComponentLoader from "./ComponentLoader";

import OakCard from "./components/OakCard";
import OakProject from "./components/OakProject";
import OakSection from "./components/OakSection";

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

    // set app.actions to all defined global actions
    Object.defineProperty(this, "actions", { value: actions });

    // App state.
    // NOTE: NEVER update this directly, use `app.action.setState()` or some sugary variant thereof.
    this.state = {
      editing: true,
      selection: Object.freeze([])
    }

  }


  //////////////////////////////
  //  Browser event data
  //////////////////////////////

  // Set the current event.
  // TODO: is this a trigger ????
  setEvent(oakEvent, browserEvent) {
    oakEvent._browserEvent = browserEvent;
    app.event = oakEvent;
    oakEvent._log();
  }

// REFACTOR: MOVE INTO EDITOR?
  // Return the currently selected elements (as a list of `oid`s).
  // NOTE: this is a FROZEN array!
  get selection() {
    return this.state.selection;
  }

// REFACTOR: MOVE INTO EDITOR?
  getRectForOid(oid) {
    const element = document.querySelector(`[data-oid='${oid}']`);
    return elements.offsetRect(element);
  }

// REFACTOR: MOVE INTO EDITOR?
  getOidRects() {
    if (!this.projectComponent) return undefined;
    console.time("oidRects");
    //TODO: somehow we want to know the root element on the page so don't include toolbars...
    const oidElements = document.querySelectorAll("[data-oid]");
    const rects = [];
    let i = -1, element;
    while (element = oidElements[++i]) {
      rects[i] = elements.offsetRect(element);
      rects[i].oid = element.getAttribute("data-oid");
    }
    console.timeEnd("oidRects");

    if (!this._renderCache) this._renderCache = {};
    this._renderCache.oidRects = rects;
    return rects;
  }


  //////////////////////////////
  //  Actions / Undo / State / etc
  //////////////////////////////

  undo() {
    app.undoQueue.undo();
  }

  redo() {
    app.undoQueue.redo();
  }

  get canUndo() { return app.undoQueue.canUndo }
  get canRedo() { return app.undoQueue.canRedo }

  // Force update of the entire app, including any changed props in card/section/project
  @debounce(0)
  updateSoon() {
    if (app._appRoute) app._appRoute.setState({});
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

  // Return URL for card, section or project
  getCardRoute(projectId, sectionId = 0, cardId = 0) {
    return `/project/${projectId}/${sectionId}/${cardId}`;
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


  // Given an oid, return the component that it corresponds to.
  getComponentForOid(oid) {
    if (!oid) return undefined;

    if (this.card) {
      const component = this.card.getComponentForOid(oid);
      if (component) return component;
    }

    if (this.section) {
      const component = this.section.getComponentForOid(oid);
      if (component) return component;
    }

    if (this.project) {
      const component = this.project.getComponentForOid(oid);
      if (component) return component;
    }
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
//       .catch(error => {
//         console.group(`Error loading project ${projectIdentifier}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load project");
//       });
  }

  //////////////////////////////
  //  Sections!
  //////////////////////////////

  showSection(projectIdentifier, sectionIdentifier) {
    const route = this.getCardRoute(projectIdentifier, sectionIdentifier);
    app.goTo(route);
  }

  getSection(projectIdentifier, sectionIdentifier) {
    const project = this.getProject(projectIdentifier);
    if (project) return project.getSection(sectionIdentifier);
  }

  loadSection(projectIdentifier, sectionIdentifier) {
    const section = this.getSection(projectIdentifier, sectionIdentifier);
    if (section) return section.load();

    return this.loadProject(projectIdentifier)
      .then( project => {
        return project.loadSection(sectionIdentifier);
      })
//       .catch(error => {
//         console.group(`Error loading section ${projectIdentifier}/${sectionIdentifier}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load section");
//       });
  }


  //////////////////////////////
  //  Cards!
  //////////////////////////////

  showCard(projectIdentifier, sectionIdentifier, cardIdentifier) {
    const route = this.getCardRoute(projectIdentifier, sectionIdentifier, cardIdentifier);
    app.goTo(route);
  }

  getCard(projectIdentifier, sectionIdentifier, cardIdentifier) {
    const section = this.getSection(projectIdentifier, sectionIdentifier);
    if (section) return section.getCard(cardIdentifier);
  }

  loadCard(projectIdentifier, sectionIdentifier, cardIdentifier) {
    const card = this.getCard(projectIdentifier, sectionIdentifier, cardIdentifier);
    if (card) return card.load();

    return this.loadSection(projectIdentifier, sectionIdentifier)
      .then( section => {
        return section.loadCard(cardIdentifier);
      })
//       .catch(error => {
//         console.group(`Error loading card ${projectIdentifier}/${sectionIdentifier}/${cardIdentifier}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load card");
//       });
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


  // Return the section index singleton for a specific project.
  getSectionIndex(projectPath) {
    return this._getFromRegistry("STACK-INDEX:", projectPath, this._makeSectionIndex)
  }

  // Create a section index on demand.
  // DO NOT CALL THIS!  Use `app.getSectionIndex()` instead.
  _makeSectionIndex(projectPath) {
    const projectId = projectPath;
    return new LoadableIndex({
      itemType: "section",
      loadIndex: () => {
        return api.loadSectionIndex(projectPath);
      },
      createItem: (sectionId, props) => {
        return new Section({
          sectionId,
          projectId,
          ...props,
          app: this,
        });
      }
    });
  }


  // Return the card index singleton for a specific section.
  getCardIndex(sectionPath) {
    return this._getFromRegistry("CARD-INDEX:", sectionPath, this._makeCardIndex)
  }

  // Create a card index on demand.
  // DO NOT CALL THIS!  Use `app.getCardIndex()` instead.
  _makeCardIndex(sectionPath) {
    const [ projectId, sectionId ] = sectionPath.split("/");
    return new LoadableIndex({
      itemType: "card",
      loadIndex: () => {
        return api.loadCardIndex(sectionPath);
      },
      createItem: (cardId, props) => {
        return new Card({
          cardId,
          sectionId,
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
    console.warn(`app.getPath(${pathOrController}): cant figure out path`);
  }

  getLoader(pathOrController, makeIfNecessary) {
    if (pathOrController instanceof ComponentLoader) return pathOrController;

    const path = this.getPath(pathOrController);
    if (!path) return;
    const [ projectId, sectionId, cardId ] = path.split("/");
    if (cardId) return app.getCardLoader(pathOrController, makeIfNecessary);
    if (sectionId) return app.getSectionLoader(pathOrController, makeIfNecessary);
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

  // Return the singleton loader for some section.
  getSectionLoader(section, makeIfNecessary) {
    const makeLoader = makeIfNecessary && section instanceof Section && this._makeSectionLoader;
    return this._getFromRegistry("STACK-LOADER:", section, makeLoader);
  }

  // Create a section loader on demand.
  // DO NOT CALL THIS!  Use `app.getSectionLoader()` instead.
  _makeSectionLoader(section) {
    return new ComponentLoader({
      type: "Section",
      path: section.path,
      controller: section,
      SuperConstructor: OakSection
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

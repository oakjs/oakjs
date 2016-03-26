//////////////////////////////
//
//  App singleton for oak editor app
//
//  TODO: instantiation pattern?
//////////////////////////////

import { preference } from "oak-roots/util/preference";
import { debounce } from "oak-roots/util/decorators";
import elements from "oak-roots/util/elements";
import global from "oak-roots/util/global";
import LoadableIndex from "oak-roots/LoadableIndex";
import Registry from "oak-roots/Registry";
import UndoQueue from "oak-roots/UndoQueue";

import actions from "./actions";
import api from "./api";
import OakEvent from "./OakEvent";
import Page from "./Page";
import Project from "./Project";
import Section from "./Section";
import ComponentLoader from "./ComponentLoader";

import OakPage from "./components/OakPage";
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

    // Set app.actions to all defined global actions.
    Object.defineProperty(this, "actions", { value: actions });

    // Initialize app state from `localStorage`.
    this._initState();

    // `app.runner` is the player/editor ui root
    this.runner = {};

    // Registry of loaded projects/sections/pages/etc
    this.registry = new Registry();

    // Create the global undoQueue
    this.undoQueue = new UndoQueue();

    // load the project index to start with since that's the first thing we'll need
    this.projectIndex.load();
  }


  //////////////////////////////
  //  Browser event data
  //////////////////////////////

  // Set the current event.
  // TODO: is this a trigger ????
  // REFACTOR:  this pattern is not clear...
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
  //  Actions / Undo / State / preferences / etc
  //////////////////////////////

  undo() {
    app.undoQueue.undo();
  }

  redo() {
    app.undoQueue.redo();
  }

  get canUndo() { return app.undoQueue.canUndo }
  get canRedo() { return app.undoQueue.canRedo }

  // Force update of the entire app, including any changed props in page/section/project
  @debounce(0)
  updateSoon() {
    if (app._appRoute) app._appRoute.setState({});
  }


  //////////////////////////////
  //  App State
  //////////////////////////////

  // Set app state in an undo-able way.
  setState(deltas) {
    app.actions.setAppState({ state: deltas });
  }

  // Initialize app state.
  // DON'T CALL THIS, it will be called automatically when the app is constructed.
  _initState() {
    // App state, which we store in localStorage and reload when reloading the page.
    // NOTE: NEVER update this directly, use `app.action.setState()` or some sugary variant thereof.
    const savedState = this.preference("app.state") || { editing: false };

    // default selection and freeze it so it doesn't get modified here
    if (!savedState.selection) savedState.selection = [];
    Object.freeze(savedState.selection);

    // save and freeze app state
    this.state = Object.freeze(savedState);
  }

  // Set current state and save in localStorage.
  // DON'T CALL THIS, `setState()` will call it for you.
  _saveState(newState) {
    this.state = Object.freeze(newState);
    this.preference("app.state", this.state);
    this.updateSoon();
  }

  //////////////////////////////
  //  App preferences (how is this different than state?)
  //////////////////////////////

  // Get/set/clear a JSON-stringified 'preference' stored in `localStorage`.
  // Specfy:
  //  - `key` only to get a value,
  //  - `key, `value`, to set a preference value.
  //  - `key, null` to clear a value.
  preference(...args) {
    if (!typeof args[0] === "string") {
      console.warn(`app.preference(${args}): first argument must be a string`);
      return undefined;
    }
    args[0] = "-oak-" + args[0];
    return preference(...args);
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

  // Return URL for page, section or project
  getPageRoute(projectId, sectionId, pageId) {
    if (pageId !== undefined) return `/project/${projectId}/${sectionId}/${pageId}`;
    if (sectionId !== undefined) return `/project/${projectId}/${sectionId}`;
    if (projectId !== undefined) return `/project/${projectId}`;
    throw new TypeError(`app.getPageRoute(${projectId}, ${sectionId}, ${pageId}): invalid params`);
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

    if (this.page) {
      const component = this.page.getComponentForOid(oid);
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
    const route = this.getPageRoute(projectIdentifier);
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
    const route = this.getPageRoute(projectIdentifier, sectionIdentifier);
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
  //  Pages!
  //////////////////////////////

  showPage(projectIdentifier, sectionIdentifier, pageIdentifier) {
    const route = this.getPageRoute(projectIdentifier, sectionIdentifier, pageIdentifier);
    app.goTo(route);
  }

  getPage(projectIdentifier, sectionIdentifier, pageIdentifier) {
    const section = this.getSection(projectIdentifier, sectionIdentifier);
    if (section) return section.getPage(pageIdentifier);
  }

  loadPage(projectIdentifier, sectionIdentifier, pageIdentifier) {
    const page = this.getPage(projectIdentifier, sectionIdentifier, pageIdentifier);
    if (page) return page.load();

    return this.loadSection(projectIdentifier, sectionIdentifier)
      .then( section => {
        return section.loadPage(pageIdentifier);
      })
//       .catch(error => {
//         console.group(`Error loading page ${projectIdentifier}/${sectionIdentifier}/${pageIdentifier}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load page");
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


  // Return the page index singleton for a specific section.
  getPageIndex(sectionPath) {
    return this._getFromRegistry("CARD-INDEX:", sectionPath, this._makePageIndex)
  }

  // Create a page index on demand.
  // DO NOT CALL THIS!  Use `app.getPageIndex()` instead.
  _makePageIndex(sectionPath) {
    const [ projectId, sectionId ] = sectionPath.split("/");
    return new LoadableIndex({
      itemType: "page",
      loadIndex: () => {
        return api.loadPageIndex(sectionPath);
      },
      createItem: (pageId, props) => {
        return new Page({
          pageId,
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
    const [ projectId, sectionId, pageId ] = path.split("/");
    if (pageId) return app.getPageLoader(pathOrController, makeIfNecessary);
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

  // Return the singleton loader for some page.
  getPageLoader(page, makeIfNecessary) {
    const makeLoader = makeIfNecessary && page instanceof Page && this._makePageLoader;
    return this._getFromRegistry("CARD-LOADER:", page, makeLoader);
  }

  // Create a page loader on demand.
  // DO NOT CALL THIS!  Use `app.getPageLoader()` instead.
  _makePageLoader(page) {
    return new ComponentLoader({
      type: "Page",
      path: page.path,
      controller: page,
      SuperConstructor: OakPage
    });
  }

}

// Create an instance and export it
app = new App();
export default app;

// globalize for reflection
global.app = app;

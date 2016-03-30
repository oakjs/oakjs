//////////////////////////////
//
//  App singleton for `oak` web application.
//
//  TODO: instantiation pattern?
//////////////////////////////

import { preference } from "oak-roots/util/preference";
import { debounce } from "oak-roots/util/decorators";
import elements from "oak-roots/util/elements";
import global from "oak-roots/util/global";
import UndoQueue from "oak-roots/UndoQueue";

import actions from "./actions";
import OakEvent from "./OakEvent";
import ProjectLoader from "./ProjectLoader";

import SUIComponents from "themes/SUI/components";
import oakComponents from "./components";

let oak;

class OakJS {
  constructor() {
    // There can be only one!
    if (global.oak) {
      const message = "Second instance of `oak` created.  BAD!!!";
      console.error(message);
      throw new ReferenceError(message);
    }

    // Set oak.actions to all defined global actions.
    Object.defineProperty(this, "actions", { value: actions });

    // Initialize application state from `localStorage`.
    this._initState();

    // `oak.runner` is the player/editor ui root
    this.runner = {};

    // Registry of loaded projects/sections/pages/etc
    this.loader = new ProjectLoader(this);

    // Create the global undoQueue
    this.undoQueue = new UndoQueue();
  }


  //////////////////////////////
  //  Browser event data
  //////////////////////////////

  // Set the current event.
  // TODO: is this a trigger ????
  // REFACTOR:  this pattern is not clear...
  setEvent(oakEvent, browserEvent) {
    oakEvent._browserEvent = browserEvent;
    oak.event = oakEvent;
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
    return elements.clientRect(element);
  }

// REFACTOR: MOVE INTO EDITOR?
  getOidRects() {
    if (!this._projectComponent) return undefined;
    console.time("oidRects");
    //TODO: somehow we want to know the root element on the page so don't include toolbars...
    const oidElements = document.querySelectorAll("[data-oid]");
    const rects = [];
    let i = -1, element;
    while (element = oidElements[++i]) {
      rects[i] = elements.clientRect(element);
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
    oak.undoQueue.undo();
  }

  redo() {
    oak.undoQueue.redo();
  }

  get canUndo() { return oak.undoQueue.canUndo }
  get canRedo() { return oak.undoQueue.canRedo }

  // Force update of the entire oak, including any changed props in page/section/project
  @debounce(0)
  updateSoon() {
    if (oak._appRoute) oak._appRoute.setState({});
  }


  //////////////////////////////
  //  App State
  //////////////////////////////

  // Set oak state in an undo-able way.
  setState(deltas) {
    oak.actions.setAppState({ state: deltas });
  }

  // Initialize application state.
  // DON'T CALL THIS, it will be called automatically when the oak is constructed.
  _initState() {
    // App state, which we store in localStorage and reload when reloading the page.
    // NOTE: NEVER update this directly, use `oak.action.setState()` or some sugary variant thereof.
    const savedState = this.preference("appState") || { editing: false };

    // default selection and freeze it so it doesn't get modified here
    if (!savedState.selection) savedState.selection = [];
    Object.freeze(savedState.selection);

    // save and freeze oak state
    this.state = Object.freeze(savedState);
  }

  // Set current state and save in localStorage.
  // DON'T CALL THIS, `setState()` will call it for you.
  _saveState(newState) {
    this.state = Object.freeze(newState);
    this.preference("appState", this.state);
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
      console.warn(`oak.preference(${args}): first argument must be a string`);
      return undefined;
    }
    args[0] = "-oak-" + args[0];
    return preference(...args);
  }


  //////////////////////////////
  //  Routing
  //////////////////////////////

  goTo(route, replace) {
    if (!oak._router) throw new TypeError(`oak.goTo(${route}): oak._router is not set`);

    if (replace || oak._router.isActive(route)) {
      oak._router.replace(route);
    }
    else {
      oak._router.push(route);
    }
  }

  // Return URL for page, section or project
  getPageRoute(projectId, sectionId, pageId) {
    if (pageId !== undefined) return `/project/${projectId}/${sectionId}/${pageId}`;
    if (sectionId !== undefined) return `/project/${projectId}/${sectionId}`;
    if (projectId !== undefined) return `/project/${projectId}`;
    throw new TypeError(`oak.getPageRoute(${projectId}, ${sectionId}, ${pageId}): invalid params`);
  }

  get projects() { return this.projectIndex.items }

  showProject(projectIdentifier) {
    const route = this.getPageRoute(projectIdentifier);
    oak.goTo(route);
  }

  showSection(projectIdentifier, sectionIdentifier) {
    const route = this.getPageRoute(projectIdentifier, sectionIdentifier);
    oak.goTo(route);
  }

  showPage(projectIdentifier, sectionIdentifier, pageIdentifier) {
    const route = this.getPageRoute(projectIdentifier, sectionIdentifier, pageIdentifier);
    oak.goTo(route);
  }



  //////////////////////////////
  //  Components
  //////////////////////////////

  // All known projects.
  get projects() {
    return this.loader.projectIndex.items
  }

  // Get a project by id
  getProject(projectId) {
    return this.loader.getProject(projectId)
  }

  // Return a section by id
  getSection(projectId, sectionId) {
    return this.loader.getSection(projectId, sectionId)
  }

  // Return a page by id
  getPage(projectId, sectionId, pageId) {
    return this.loader.getPage(projectId, sectionId, pageId)
  }

  // All known components
  // TODO: this should really be dynamic...
  components = Object.assign({}, SUIComponents, oakComponents)

  // Define a theme-ful of `components` for a `project`.
  setProjectTheme(projectId, components) {
    const themes = this.__PROJECT_THEMES__ || (this.__PROJECT_THEMES__ = {});
    themes[projectId] = components;
  }

  // Return theme components defined for a `project`.
  getProjectTheme(projectId) {
    return oak.__PROJECT_THEMES__[projectId] || this.components;
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


}

// Create an instance and export it
oak = new OakJS();
export default oak;

// globalize for reflection
global.oak = oak;

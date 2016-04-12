//////////////////////////////
//
//  App singleton for `oak` web application.
//
//  TODO: instantiation pattern?
//////////////////////////////

import Eventful from "oak-roots/Eventful";
import { preference } from "oak-roots/util/preference";
import { debounce } from "oak-roots/util/decorators";
import elements from "oak-roots/util/elements";
import global from "oak-roots/util/global";
import UndoQueue from "oak-roots/UndoQueue";

import actions from "./actions";
import OakEvent from "./OakEvent";
import ProjectLoader from "./ProjectLoader";

import oakComponents from "./components";
import HTML_EDITOR_SETTINGS from "./components/theme/html";

let oak;

class OakJS extends Eventful(Object) {

  _debugEvents = true;

  constructor() {
    super();

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
  //  App State
  //////////////////////////////

  // Set oak state in an undo-able way.
  setState(deltas) {
    oak.actions.setAppState({ state: deltas });
  }

  static DEFAULT_STATE = {
    editing: false,         // Are we currently editing?
    editContext: "page",    // What we're editing: "page", "section", "project". "component"?
    selection: [],          // Array of `oid`s selected in the editor.
  }

  // Initialize application state.
  // DON'T CALL THIS, it will be called automatically when the oak is constructed.
  _initState() {
    // App state, which we store in localStorage and reload when reloading the page.
    // We pick up new values added to `DEFAULT_STATE`.
    // NOTE: NEVER update this directly, use `oak.action.setState()` or some sugary variant thereof.
    const savedState = Object.assign({}, this.constructor.DEFAULT_STATE, this.preference("appState"));

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
  //  State syntactic sugar
  //////////////////////////////

  // Return the `ComponentController` for the current `appState.editContext`,
  //  a `page`, `section` or `project`.
  // Returns `undefined` if the specified context is not found.
  get editContext() {
    switch (this.state.editContext) {
      case "page": return this.page;
      case "section": return this.section;
      case "project": return this.project;
    }
    console.warn(`oak.editContext(): state ${this.state.editContext} not understood`);
    return undefined;
  }

  // Return the currently selected elements (as a list of `oid`s).
  // NOTE: this is a FROZEN array!
  get selection() {
    return this.state.selection;
  }

  // Return the HTML elements which correspond to the selection.
  // TODO: this could get out of sync with `selection` and `selectedComponents`
  get selectedElements() {
    return this.selection.map( oid => this.getElementForOid(oid) ).filter(Boolean);
  }

  // Return the `JSXElement`s which correspond to the selection.
  // TODO: this could get out of sync with `selection` and `selectedElements`
  get selectedComponents() {
    return this.selection.map( oid => this.getEditableComponentForOid(oid) ).filter(Boolean);
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
  components = Object.assign({}, oakComponents)

  // Define a theme-ful of `components` for a `project`.
  setProjectTheme(projectId, components) {
    const themes = this.__PROJECT_THEMES__ || (this.__PROJECT_THEMES__ = {});
    themes[projectId] = components;
  }

  // Return theme components defined for a `project`.
  getProjectTheme(projectId) {
    return oak.__PROJECT_THEMES__[projectId] || this.components;
  }

  // Given a string `type` from a JSXE, return the `Component` class it corresponds to.
  getComponentConstructorForType(type, errorMessage, components = this.components) {
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

  getComponentConstructorForOid(oid) {
    const component = this.getComponentForOid(oid);
    if (component) return this.getComponentConstructorForType(component.type);
  }

  static DEFAULT_EDITOR_SETTINGS = { draggable: true, droppable: false };

  getEditSettingsForType(type) {
    const constructor = this.getComponentConstructorForType(type);
    if (!constructor) return;

    if (typeof constructor === "string") {
      if (HTML_EDITOR_SETTINGS[type]) return HTML_EDITOR_SETTINGS[type];
      console.warn(`oak.getEditSettingsForType(${type}): cant find html type!`);
    }
    else {
      if (constructor.editProps) return constructor.editProps;
      console.warn(`oak.getEditSettingsForType(${type}): cant find 'editProps' settings for type!`);
    }
    return DEFAULT_EDITOR_SETTINGS;
  }

  //////////////////////////////
  //  Oid => Component => Oid
  //////////////////////////////

  // Return the JSXElement `Component` for an `oid`,
  // but only for components which are editable.
  getEditableComponentForOid(oid) {
    return this.getComponentForOid(oid, [ this.editContext ]);
  }

  // Given an oid, return the component that it corresponds to.
  getComponentForOid(oid, controllers = [ this.page, this.section, this.project ]) {
    if (!oid) return undefined;

    for (let controller of controllers) {
      if (controller) {
        const component = controller.getComponentForOid(oid);
        if (component) return component;
      }
    }
  }

  // Given an oid, return the `context` it belongs to:
  //  - the `page`, `section` or `project`.
  // Returns `undefined` if not found.
  getContextForOid(oid) {
    if (!oid) return undefined;

    if (this.page && this.page.getComponentForOid(oid)) {
      return this.page;
    }

    if (this.section && this.section.getComponentForOid(oid)) {
      return this.section
    }

    if (this.project && this.project.getComponentForOid(oid)) {
      return this.project
    }
  }

  getElementForOid(oid) {
    return document.querySelector(`[data-oid='${oid}']`);
  }

  // Given an `oid`, return the `clientRect` for it as currently rendered.
  getRectForOid(oid) {
    const element = this.getElementForOid(oid);
    return elements.clientRect(element);
  }

  // Return a map of `{ oids, rects }` for all `oid` elements on the page.
  //
  // Pass an `onlyOids` map to restrict to only those elements.
  // Pass an `intersectingClientRect` to restrict to only oids which intersect that rect.
  getOidRects(onlyOids, intersectingClientRect) {
    if (!this._projectComponent) return undefined;
//    console.time("oidRects");
    //TODO: somehow we want to know the root element on the page so don't include toolbars...
    const oidElements = document.querySelectorAll("[data-oid]");
    const oids = [];
    const rects = [];
    let i = -1, element;
    while (element = oidElements[++i]) {
      const oid = element.getAttribute("data-oid");

      // skip if not in the `onlyOids` map
      if (onlyOids && onlyOids[oid] === undefined) continue;

      // skip if doesn't intersect the `intersectingClientRect`
      const rect = elements.clientRect(element);
      if (intersectingClientRect && !intersectingClientRect.intersects(rect)) continue;

      // ok, add to our lists
      oids.push(oid);
      rects.push(rect);
    }
//    console.timeEnd("oidRects");
    return { oids, rects };
  }

  // Return a map of `{ oids, rects }` for all `oid` elements on the specified `context`.
  getOidRectsForContext(context, intersectingClientRect, includeContextRoot = false) {
    const { oids, rects } = this.getOidRects(context.oids, intersectingClientRect);

    // Remove the context root oid if specified
    if (!includeContextRoot) {
      const index = oids.indexOf(context.oid);
      if (index !== -1) {
        oids.splice(index, 1);
        rects.splice(index, 1);
      }
    }

    return { oids, rects };
  }

  // Return a clone of an oid component's element.
  // Returns `undefined` if the element can't be found.
  cloneOid(oid) {
    const element = document.querySelector(`[data-oid='${oid}']`);
    if (!element) return undefined;
    return element.cloneNode(true);
  }

  // Return a list cloned elements for a list of `oids`.
  cloneOids(oids) {
    if (!oids) return [];
    return oids.map(oid => oak.cloneOid(oid)).filter(Boolean);
  }


  //////////////////////////////
  //  Debug
  //////////////////////////////
  toString() {
    return "[oak]";
  }

}

// Create an instance and export it
oak = new OakJS();
export default oak;

// globalize for reflection
global.oak = oak;

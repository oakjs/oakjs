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

import Account from "./Account";
import actions from "./actions";
import EditorProps from "./EditorProps";
import OakEvent from "./OakEvent";
import Page from "./Page";
import Project from "./Project";
import Section from "./Section";

import oakComponents from "./components";
import Stub from "./components/Stub";
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

    // Create the global undoQueue
    this.undoQueue = new UndoQueue();

    // `oak.account` represents all projects / sections / pages this "user" can see.
//REFACTOR:  add user concept...
    this.account = new Account({ oak: this });

    // load the account, since we have to do that before we can display anything
    this.account.load();
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

  // Syntactic sugar for enabling actions, etc.
  get selectionIsEmpty() {
    return this.selection.length === 0;
  }

  // Return the `JSXElement`s which correspond to the selection.
  get selectedComponents() {
    return this.selection.map( oid => this.getEditableComponentForOid(oid) ).filter(Boolean);
  }

  // Return the FIRST selected component of the specified type.
  // Returns `undefined` if no such component was found.
  getSelectedComponent(type) {
    return this.selectedComponents.filter( component => component.type === type )[0];
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
//TODO: throttle?
  updateSoon() {
    clearTimeout(oak._updateTimer);
    oak._updateTimer = setTimeout(oak.forceUpdate, 0);
  }

  forceUpdate() {
    clearTimeout(oak._updateTimer);
    if (!oak._appRoute) return;
//console.log("oak.forceUpdate()");
    oak._appRoute.setState({});
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

  get projects() { return this.projectIndex.items }

  // Return URL for page, section or project
  getPageRoute(projectId, sectionId, pageId) {
    if (pageId !== undefined) return `/project/${projectId}/${sectionId}/${pageId}`;
    if (sectionId !== undefined) return `/project/${projectId}/${sectionId}`;
    if (projectId !== undefined) return `/project/${projectId}`;
    throw new TypeError(`oak.getPageRoute(${projectId}, ${sectionId}, ${pageId}): invalid params`);
  }

  //////////////////////////////
  //  Syntactic sugar for getting project/section/page components
  //////////////////////////////

  // Get project, section, component specified by path.
  get(path) {
    if (path && typeof path === "string") {
      const split = Page.splitPath(path);
      if (split.pageId) return this.getPage(split.projectId, split.sectionId, split.pageId);
      if (split.sectionId) return this.getSection(split.projectId, split.sectionId);
      if (split.projectId) return this.getProject(split.projectId);
    }
    // Special case for account (which is not a real path).
    if (path === Account.ACCOUNT_PATH_FLAG) return oak.account;

    // Unclear what to do here...
    console.warn(`oak.get(${path}): path not understood`);
    return undefined;
  }

  // All known projects.
  get projects() {  return this.account.projects }

  // Get a project by projectId or numeric index, or by single path string.
  // NOTE: you can pass a page path to this and it'll take just the first bit.
  getProject(projectId) { return this.account.getProject(...arguments) }

  // Return a section by projectId + sectionId indices or strings, or by single path string.
  // NOTE: you can pass a page path to this and it'll take just the first bit.
  getSection(projectId, sectionId) { return this.account.getSection(...arguments) }

  // Return a section by projectId + sectionId indices or strings, or by single path string.
  getPage(projectId, sectionId, pageId) { return this.account.getPage(...arguments) }


  //////////////////////////////
  //  Syntactic sugar for getting components
  //////////////////////////////

  // All known components
  // TODO: this should really be dynamic...
  components = Object.assign({}, oakComponents)

  // Define a theme-ful of `components` for a `project`.
// DEPRECATE?
  setProjectTheme(projectId, components) {
    const themes = this.__PROJECT_THEMES__ || (this.__PROJECT_THEMES__ = {});
    themes[projectId] = components;
  }

  // Return theme components defined for a `project`.
// DEPRECATE?
  getProjectTheme(projectId) {
    return oak.__PROJECT_THEMES__[projectId] || this.components;
  }

  // Given a string `type` from a JSXE, return the `Component` class it corresponds to.
  lookupComponent(type, components, errorMessage) {
    // If we got a function (or a class), just use that.
    if (typeof type === "function") return type;
    if (typeof type === "string" && type.toLowerCase() === type) return type;

// TODO: we should arguably fail if they didn't pass in components...
    if (!components) components = (this.editContext ? this.editContext.components : this.components);

    if (typeof type === "string") {
      // return it if we can find it in our `components`
      if (components[type]) return components[type];
    }

    // log an error if they gave us an errorMessage
    if (errorMessage) console.error(`${errorMessage}: type = '${type}'`);

    // Return <Stub>
    return Stub;
  }

// DEPRECATE???
  // Return the `editorProps` for a given constructor.
  // This tells us, eg, if we can drag into them, etc.
  getEditorProps(constructor) {
    if (typeof constructor === "string") {
      if (HTML_EDITOR_SETTINGS[constructor]) return HTML_EDITOR_SETTINGS[constructor];
      console.warn(`oak.getEditorProps(${constructor}): cant find html type!`);
    }
    else if (constructor) {
      if (constructor.editorProps) return constructor.editorProps;
      console.warn(`oak.getEditorProps(): cant find 'editorProps' settings for '${constructor.name}'!`);
    }
    return new EditorProps();
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
    if (!Array.isArray(controllers)) controllers = [controllers];

    for (let controller of controllers) {
      if (controller) {
        const component = controller.getComponentForOid(oid);
        if (component) return component;
      }
    }
  }

  // Given an oid, return the `controller` it belongs to:
  //  - the `page`, `section` or `project`.
  // Returns `undefined` if not found.
// DEPRECATED?
  getControllerForOid(oid) {
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
    if (!this.page || !this.page.component) return undefined;
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

  // Return a map of `{ oids, rects }` for all `oid` elements on the specified `controller`.
  getOidRectsForController(controller = this.editContext, intersectingClientRect, includeContextRoot = false) {
    const { oids, rects } = this.getOidRects(controller.oids, intersectingClientRect) || {};

    // Remove the controller root oid if specified
    if (!includeContextRoot) {
      const index = oids.indexOf(controller.oid);
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

  //
  //  Event handling
  //

  // Force a redraw when window is resized.
  @debounce(100)
  onWindowResized(event) {
    oak.forceUpdate();
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


// When window is resized, update everything. (???)
$(window).on("resize", oak.onWindowResized);

// globalize for reflection
global.oak = oak;

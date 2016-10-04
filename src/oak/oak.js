//////////////////////////////
//
//  App singleton for `oak` web application.
//  There can be only one.
//  And it's created and exported at the bottom of this file.
//
//////////////////////////////

import { preference } from "oak-roots/util/preference";
import { debounce } from "oak-roots/util/decorators";
import elements from "oak-roots/util/elements";
import global from "oak-roots/util/global";
import { classNames, unknownProps } from "oak-roots/util/react";
import UndoQueue from "oak-roots/UndoQueue";

import Account from "./Account";
import actions from "./actions";
import ComponentController from "./ComponentController";
import OakEvent from "./OakEvent";
import Page from "./Page";
import Project from "./Project";
import Section from "./Section";

import OakComponent from "./components/OakComponent";
import Stub from "./components/Stub";

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
//TODO: this is app state, right?
    this.runner = {};

    // Create the global undoQueue
    this.undoQueue = new UndoQueue();

    // `oak.account` represents all projects / sections / pages this "user" can see.
//REFACTOR:  add user concept...
    this.account = new Account({ oak: this });

    // load the account, since we have to do that before we can display anything
//TODO: this is an action???
    this.account.load();
  }


  //////////////////////////////
  //  "Current" + "Runner" project / section / page
  //  Many bits of the UI need to coordinate on what it is that we're displaying right now.
  //  We set `oak.page` to the current page we're displaying and drive other things from that.
  //////////////////////////////

  // Set the "current" page.
  //  Also sets `project` and `section` pointers for expediency. (???)
  //  NOTE: better would be to derive project/section from the page,
  //        buts lots of UI code (eg: menus) look at `oak.project`,
  //        so that might be slow.
  setCurrentPage(page) {
//TODO: do an oak.setState() with path?
    this.page = page;
    this.project = page && page.project;
    this.section = page && page.section;
  }

  // Set the page that's being shown by the runner meta-application.
  //  Also sets `project` and `section` pointers.
  //  We only expect to have one `runner page` open at a time,
  //  so pointing directly to those pages is probably fine.
  setRunnerPage(page) {
//TODO: do an oak.setState() with path?
    this.runner.page = page;
    this.runner.project = page && page.project;
    this.runner.section = page && page.section;
  }


  //////////////////////////////
  //  App State
  //////////////////////////////

  // Set oak state in an undo-able way.
  setState(deltas) {
    oak.actions.setAppState({ state: deltas });
  }

  static DEFAULT_STATE = {
    editController: "Page",   // What we're editing: "Page", "Section", "Project". "Component"?
  }

  // Initialize application state.
  // DON'T CALL THIS, it will be called automatically when the oak is constructed.
  _initState() {
    // App state, which we store in localStorage and reload when reloading the page.
    // We pick up new values added to `DEFAULT_STATE`.
    // NOTE: NEVER update this directly, use `oak.action.setState()` or some sugary variant thereof.
    const savedState = Object.assign({}, this.constructor.DEFAULT_STATE);

    // default selection so it doesn't get modified here
    if (!savedState.selection) savedState.selection = [];

    // save oak state
    this.state = savedState;
  }


  //////////////////////////////
  //  State syntactic sugar
  //////////////////////////////

  // Return the `ComponentController` for the current `appState.editController`,
  //  a `page`, `section` or `project`.
  // Returns `undefined` if the specified context is not found.
  get editController() {
    switch (this.state.editController) {
      case "Page": return this.page;
      case "Section": return this.section;
      case "Project": return this.project;
    }
    console.warn(`oak.editController(): edit controller ${this.state.editController} not understood`);
    return undefined;
  }

  // Are we currently in "selecting" mode?
  get isSelecting() {
    return this.editController && this.editController.isSelecting;
  }

  // Does the current editController need to save?
  get editControllerIsDirty() {
    return this.editController && this.editController.isDirty;
  }

  // Return the currently selected elements (as a list of `oid`s).
  // ALWAYS returns an array.
  get selection() {
    return (this.editController && this.editController.selection) || [];
  }

  // Syntactic sugar for enabling actions, etc.
  get selectionIsEmpty() {
    return this.selection.length === 0;
  }

  // Return the `JSXElement`s which correspond to the selection.
  // ALWAYS returns an array.
  get selectedComponents() {
    return (this.editController && this.editController.selectedComponents) || [];
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

  // NOTE: We don't use throttle/debounce here because we want a `_forceUpdate()`
  //       to cancel any pending `updateSoon()`s... ???
  updateSoon() {
    clearTimeout(oak._updateTimer);
    oak._updateTimer = setTimeout(oak._forceUpdate, 1);
  }

  // Force update of the entire oak, including any changed props in page/section/project
  // NOTE: do NOT call this directly, use `oak.updateSoon()` instead.
  _forceUpdate() {
    clearTimeout(oak._updateTimer);
    // if `oak._appRoute` is not set, we either haven't drawn yet or are in the middle of redrawing.
    if (oak._appRoute) oak._appRoute.setState({});
  }


  //////////////////////////////
  //  Syntactic sugar for getting project/section/page components
  //  All of these defer to `oak.account`...
  //////////////////////////////

  // Get project, section, component specified by path.
  // NOTE: we defer to the current account for this...
  get(path) {
    return this.account.get(...arguments);
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


  // Return the number of projects in the current account.  (Used in menus).
  get projectCount() { return (oak.account ? oak.account.childCount : 0) }

  // Return the number of sections in the current project.  (Used in menus).
  get sectionCount() { return (oak.project ? oak.project.childCount : 0) }

  // Return the number of pages in the current section.  (Used in menus).
  get pageCount() { return (oak.section ? oak.section.childCount : 0) }


  //////////////////////////////
  //  Working with Components
  //////////////////////////////

  // oak.Component base class for dynamically loaded components.
  Component = OakComponent;

  // All known components
  // Add components to this map with `oak.registerComponents()`.
  components = {};

  // Given a string `type` from a JSXE, return the `Component` class it corresponds to.
  lookupComponent(type, components, errorMessage) {
    // If we got a function (or a class), just use that.
    if (typeof type === "function") return type;

    // If we got an all-lowercase name, it's an HTML or SVG element
    if (typeof type === "string" && type.toLowerCase() === type) return type;

// TODO: we should arguably fail if they didn't pass in components...
    if (!components) components = (this.editController ? this.editController.components : this.components);

    if (typeof type === "string") {
      // return it if we can find it in our `components`
      if (components[type]) return components[type];
    }

    // log an error if they gave us an errorMessage
    if (errorMessage) console.error(`${errorMessage}: type = '${type}'`);

    // Return <Stub>
    return Stub;
  }


  //////////////////////////////
  //  Oid => Component => Oid
  // TODO: move these into `oak.event` or some such???
  /////////////////////////////2/

  // Given an oid, return the JSXElement that it corresponds to.
  getJSXElementForOid(oid, controllers = [ this.editController ]) {
    if (!oid) return undefined;

    for (let controller of controllers) {
      if (controller) {
        const jsxElement = controller.getJSXElementForOid(oid);
        if (jsxElement) return jsxElement;
      }
    }
  }

  // Return the DOM element for the specified oid.
  // TODO: safe to call during render() etc.
  getDOMElementForOid(oid) {
    return this.editController && this.editController.getDOMElementForOid(oid);
  }

  // Given an `oid`, return the `clientRect` for it as currently rendered.
  // Only works for our `editController`.
  // Returns `undefined` if oid not found.
  getRectForOid(oid) {
    const element = this.getDOMElementForOid(oid);
    return elements.clientRect(element);
  }


  //
  //  Modal:  Alert / Prompt / etc
  //
  // TODO: stack of modals with pop behavior...
  //

  // Show a `ModalComponent` with `props` passed in.
  // Pass a `ComponentController`, we'll make sure that is loaded and use its `Component` to display the modal.
  // You can also pass the path of a Project Component and we'll look it up for you (better error messages this way).
  // Returns a promise which resolves when they close the modal
  showModal(ModalController, props) {
    if (typeof ModalController === "string") {
      const Controller = oak.account.get(ModalController);
      if (!Controller) {
        console.error(`oak.showModal(): couldn't find component '${ModalController}'`);
        return Promise.reject();
      }
      ModalController = Controller;
    }

    if (!(ModalController instanceof ComponentController)) {
      console.error("showModal() must be called with a ComponentController!");
      return Promise.reject();
    }

    // If loadError, reject immediately
    if (ModalController.loadError) {
      console.warn("Couldn't load modal component: ", ModalController.loadError);
// TODO: throw???
      return Promise.reject(ModalController.loadError);
    }

    // If not loaded, load first and then call back to show
    if (!ModalController.isLoaded) {
      return ModalController.loadComponent()
              .catch(e => {
                console.error(`oak.showModal(${ModalController}) load error:`, e);
                return Promise.reject(e);
              })
              .then( () => oak.showModal(ModalController, props) )
    }

    let _resolve, _reject;
    const modal = oak.runner.modal = {
      controller: ModalController,
      props: {
        ...props,
        autoShow: true,
        onApprove: oak.onModalApproved,
        onDeny: oak.onModalDenied
      },
      promise: new Promise( (resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
      })
    }
    // tack resolve/reject onto the modal.promise for use in `onModalApproved` and `onModalDenied`.
    modal.promise._resolve = _resolve;
    modal.promise._reject = _reject;

    oak.updateSoon();

    return modal.promise;
  }

  // Handle click on "approve" button of the current modal.
  // Resolves the "modal promise" returned by `showModal()`.
  // Attempts to call live modal component `getValue()` routine
  //  to get "value" to pass back to promise.
  onModalApproved() {
    const modal = oak.runner.modal;
    if (!modal) return;

    const component = modal.controller.component;
    var value;
    if (component) {
//      console.info("component:", component);
      if (component.getValue) {
        value = component.getValue();
//        console.info("got value:", value);
      }
    }
    else {
      console.warn("couldn't get pointer to component!");
    }

    modal.promise._resolve(value);
    oak._closeModal();
  }

  // Handle click on the "deny" button of the current modal.
  // Rejects the "modal promise" returned by `showModal()`.
  onModalDenied(reason) {
    const modal = oak.runner.modal;
    if (!modal) return;

    const rejectValue = (reason && reason.jquery ? undefined : reason);
    modal.promise._reject(rejectValue);
    oak._closeModal();
  }

  // Stop displaying the current modal.
  // Called automatically when modal is dismissed.
  _closeModal() {
    delete oak.runner.modal;
    oak.updateSoon();
  }

  // Show `message` in an alert modal.
  // Possible `props`:  `{ header, okTitle }`
  // Returns a promise which resolves when they click `ok`.
  alert(message, props) {
    return oak.showModal("_runner/Alert", { ...props, message });
  }

  prompt(message, value, props) {
    return oak.showModal("_runner/Prompt", { ...props, message, value });
  }



  //
  //  React utilities for use in composite components
  //
  classNames = classNames;
  unknownProps = unknownProps;

  //
  //  Event handling
  //

  // Force a redraw when window is resized.
  @debounce(100)
  onWindowResized(event) {
    oak.updateSoon();
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

// When window is resized, update everything.
$(window).on("resize", oak.onWindowResized);


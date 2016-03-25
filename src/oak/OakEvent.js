//////////////////////////////
//
//  Event normalization
//
//  Watch keyboard and mouse events BEFORE they go to the normal elements
//  so we can report on the current state of things regardless of whether
//  processing is happening within an event or not.
//
//  Access `app.event.*` to figure out the current state of the world, eg:
//    - app.event.button
//    - app.event.mouseLoc
//  etc.
//
//////////////////////////////

import app from "./app";

import Point from "oak-roots/Point";
import Rect from "oak-roots/Rect";

export default class OakEvent {

//   button which is currently down:  `undefined`, `"left"` `"wheel"` or `"right"`
//   button = undefined;
//
//   current mouse coordinate
//   mouseLoc = new Point(0, 0);
//
//   place mouse last went down (only defined if it is currently down)
//   downLoc = undefined;
//
//   delta since last move event
//   moveDelta = new Point(0, 0);
//
//   map of keys which are currently down
//   keys = {};
//   keyIds = {};


  constructor(props) {
    Object.assign(this, props);
  }

  // Return a clone of this event.
  clone(props) {
    const clone = new OakEvent(this);
    if (props) Object.assign(clone, props);
    return clone;
  }


  //////////////////////////////
  // Movement sugar
  //////////////////////////////

  // Delta since last move
  get moveDelta() {
    return this._lastMouseLoc && this.mouseLoc.delta(this._lastMouseLoc);
  }

  // Direction of last move.
  get moveDirection() {
    return this.moveDelta && this.moveDelta.direction;
  }

  //////////////////////////////
  // Dragging sugar
  //////////////////////////////

  // Is the LEFT button down.
  // NOTE: NOT true if the right button is down.
  get leftButtonDown() {
    return !!this.downLoc;
  }

  // Delta between current mouse location and last mouse down event.
  // Returns `undefined` if mouse is not down.
  get dragDelta() {
    return this.downLoc && this.mouseLoc.delta(this.downLoc);
  }

  // Direction of drag.
  // Returns `undefined` if mouse is not down.
  get dragDirection() {
    return this.dragDelta && this.dragDelta.direction;
  }

  // (Sorted) rectangle for current drag.
  // Returns `undefined` if mouse is not down.
  get dragRect() {
    return Rect.rectFromPoints(this.downLoc, this.mouseLoc);
  }

  //////////////////////////////
  // OID Element detection
  //////////////////////////////

  // OID Element under the mouse
  get _mouseOid() {
    return OakEvent._getClosestOid(this.mouseTarget);
  }

  // Editable component under the mouse
  get mouseComponent() {
    return app.getComponentForOid(this._mouseOid);
  }

  // OID Element under the mouse when mouse went down
  get _downOid() {
    return OakEvent._getClosestOid(this.downTarget);
  }

  // Editable component where the mouse went down.
  get downComponent() {
    return app.getComponentForOid(this._downOid);
  }

  // Return the `oid` of the closest element with a `data-oid` attribute to the `target` element.
// REFACTOR: MOVE INTO EDITOR?
  static _getClosestOid(target) {
    if (target) {
      const oidTarget = roots.elements.closestMatching(target, "[data-oid]");
      if (oidTarget) return oidTarget.getAttribute("data-oid");
    }
    return undefined;
  }



  //////////////////////////////
  //  Mouse Move Event
  //////////////////////////////

  static MOUSE_DRAG_MIN_SIZE = 5;

  static _captureMouseMove(event) {
    const mouseLoc = new Point(event.pageX, event.pageY);
    const lastMouseLoc = app.event.mouseLoc;

    // Only run the event if the mouse has actually moved.
    // This works around a bug in Chrome Mac where it fires `mousemove` repeatedly
    //  because we're manipulating the DOM in `_getMouseTarget()`.
    if (mouseLoc.equals(lastMouseLoc)) return;

    const oakEvent = app.event.clone({
      type: "mousemove",

      // Current position of the mouse.
      mouseLoc,

      // Position of the mouse last time.
      _lastMouseLoc: lastMouseLoc,

      // Current DOM element under the mouse.
      mouseTarget: OakEvent._getMouseTarget(event),

    });

    // If the mouse is down for the primary mouse button:
    if (oakEvent.leftButtonDown) {
      // Start "isDragging" if mouse has moved at least 5 pixels since mousedown.
      if (oakEvent.downLoc && !oakEvent.isDragging) {
        oakEvent.isDragging = (oakEvent.downLoc.size > OakEvent.MOUSE_DRAG_MIN_SIZE);
      }
    }

    app.setEvent(oakEvent, event);
  }


  //////////////////////////////
  //  Mouse Down Event
  //////////////////////////////

  static _captureMouseDown(event) {
    // Do different things based on which button was pressed.
    const button = OakEvent._getMouseButton(event);
    if (button === "left") return OakEvent._captureLeftButtonDown(event);
    if (button === "right") return OakEvent._captureRightButtonDown(event);
    if (button === "wheel") return OakEvent._captureWheelButtonDown(event);
  }

  static _captureLeftButtonDown(event) {
    const oakEvent = app.event.clone({
      type: "mousedown",
      // Location where the mouse went down.
      downLoc: new Point(event.pageX, event.pageY),
      // Current DOM element under the mouse
      downTarget: OakEvent._getMouseTarget(event),
    });

    app.setEvent(oakEvent, event);
  }


  static _captureRightButtonDown(event) {
    const oakEvent = app.event.clone({
      type: "contextmenu",
      // DOM element that's the target for the menu.
      menuTarget: OakEvent._getMouseTarget(event),
    });

    app.setEvent(oakEvent, event);
  }

  static _captureWheelButtonDown(event) {
    console.error("Wheel button not supported");
  }


  //////////////////////////////
  //  Mouse Up Event
  //////////////////////////////

  static _captureMouseUp(event) {
    const oakEvent = app.event.clone({
      type: "mouseup"
    });
    app.setEvent(oakEvent, event);

    // clear mousedown data on a timeout so we remember it during this event
    setTimeout(function() {
      const oakEvent = app.event.clone({ type: "_mouseup" });
      oakEvent._clearMouseData();
      app.setEvent(oakEvent);
    }, 0);
  }


  //////////////////////////////
  //  Mousey Utility Functions
  //////////////////////////////

  // Which button is being pressed?
  // NOTE: only valid in mouseDown or mouseUp events.  Meh.
  static _getMouseButton(event) {
    if (event.button === 0) return "left";
    if (event.button === 1) return "wheel";
    if (event.button === 2) return "right";
    return undefined;
  }

  // Return the target under the mouse NOT including the selection layer
  static _getMouseTarget(event) {
    const selectionOverlay = document.querySelector("#SelectionOverlay");

    if (!selectionOverlay) return event.target;

    // hide SelectionOverlay so it doesn't mask the page
    selectionOverlay.style.display = "none";

    const target = document.elementFromPoint(event.clientX, event.clientY) || undefined;

    // restore SelectionOverlay
    selectionOverlay.style.display = "";

    return target;
  }

  _clearMouseData() {
    delete this.button;
    delete this.downLoc;
    delete this.downTarget;
    delete this.isDragging;
  }




  //////////////////////////////
  // Keyboard sugar -- NOTE: this ALWAYS reflect the current state
  //////////////////////////////

  // the definitive set of ALL the keys that are down right now
  get keys() { return OakEvent.GLOBAL_KEYS_MAP }
  get keyIds() { return OakEvent.GLOBAL_KEY_IDS_MAP }

  // Are the modifier keys currently down?
  get altKey() { return !!this.keys.Alt }
  get metaKey() { return !!this.keys.Meta }
  get shiftKey() { return !!this.keys.Shift }
  get controlKey() { return !!this.keys.Control }

  // mac alternatives
  get optionKey() { return !!this.keys.Alt }
  get commandKey() { return !!this.keys.Meta }


  //////////////////////////////
  //  Key Down Event
  //////////////////////////////

  static _captureKeydown(event) {
    const key = OakEvent.keyForEvent(event);
    const keyId = event.code;

    const oakEvent = app.event.clone({
      type: "keydown",
      key,
      keyId
    });

    // Accumulate keys which are currently down in `keys` and `keyIds`
    // NOTE: We don't get a normal key up event for CapsLock, so we can't reliably work with it.
    if (key !== "CapsLock") {
      oakEvent._addToKeyMap(key, keyId);

      // If the command-key is down:
      if (app.event.keys.Meta) {
        //  If they're typing another key
        //  turn that other key off on an immediate timeout.
        //  This works around bugs on FF Mac (at least) where we don't get a key up
        //  event for some command keys, which causes `keys` and `keyIds` to be off.
        if (!["Meta","Shift","Alt","Control"].includes(key)) {
          setTimeout(function() {
            const oakEvent = app.event.clone({ type: "_keyup" });
            oakEvent._removeFromKeyMap(key, keyId);
            app.setEvent(oakEvent);
          }, 0);
        }
      }
    }

    app.setEvent(oakEvent, event);

  // DEBUG
  //  event.preventDefault();
  }

  //////////////////////////////
  //  Key Up Event
  //////////////////////////////

  static _captureKeyup(event) {
    const key = OakEvent.keyForEvent(event);
    const keyId = event.code;

    const oakEvent = app.event.clone({
      type: "keyup",
      key,
      keyId
    });

    // remove from key maps immediately so we can detect the current state
    oakEvent._removeFromKeyMap(key, keyId);

    app.setEvent(oakEvent, event);

    // clear current key data on a timeout so we remember it during this event
    setTimeout(function() {
      const oakEvent = app.event.clone({ type: "_keyup" });
      oakEvent._clearKeyData();
      app.setEvent(oakEvent);
    }, 0);
  }

  _setKeyData() {
    delete this.key;
    delete this.keyId;
  }

  _clearKeyData() {
    delete this.key;
    delete this.keyId;
  }

  //////////////////////////////
  //  Global key maps
  //
  //  You can access these maps to figure out ALL the keys that are currently down.
  //  Access as:  `app.event.keys.Meta` or `app.event.keyIds.KeyA`
  //
  //  NOTE: do NOT modify these maps directly!!!
  //////////////////////////////

  static GLOBAL_KEYS_MAP = {};
  static GLOBAL_KEY_IDS_MAP = {};

  _addToKeyMap(key, keyId) {
    OakEvent.GLOBAL_KEYS_MAP[key] = true;
    OakEvent.GLOBAL_KEY_IDS_MAP[keyId] = true;
  }

  _removeFromKeyMap(key, keyId) {
    delete OakEvent.GLOBAL_KEYS_MAP[key];
    delete OakEvent.GLOBAL_KEY_IDS_MAP[keyId];
  }

  _clearKeyMap() {
    OakEvent.GLOBAL_KEYS_MAP = {};
    OakEvent.GLOBAL_KEY_IDS_MAP = {};
  }

  //////////////////////////////
  //  Key name normalization
  //////////////////////////////

  static keyForEvent(event) {
    return OakEvent.KEY_CODE_TO_KEY_MAP[event.keyCode]
        || String.fromCharCode(event.keyCode).toUpperCase();
  }

  // Map for numeric key code to logical key name.
  // TESTED FOR US KEYBOARDS ON MAC ONLY!!!!
  static KEY_CODE_TO_KEY_MAP = {
    "8": "Backspace",
    "9": "Tab",
    "12": "NumLock",
    "13": "Enter",
    "16": "Shift",
    "17": "Control",
    "18": "Alt",
    "19": "F15",          // firefox mac
    "20": "CapsLock",     // NOTE: firefox + chrome mac don't generate key up!
    "27": "Escape",
    "32": "Space",
    "33": "PageUp",
    "34": "PageDown",
    "35": "End",
    "36": "Home",
    "37": "Left",
    "38": "Up",
    "39": "Right",
    "40": "Down",
    "46": "Delete",
    "59": "Semicolon",		// firefox mac
    "61": "Equal",				// firefox mac
    "91": "Meta",         // chrome mac
    "93": "Meta",         // chrome mac
    "96": "Numpad0",
    "97": "Numpad1",
    "98": "Numpad2",
    "99": "Numpad3",
    "100": "Numpad4",
    "101": "Numpad5",
    "102": "Numpad6",
    "103": "Numpad7",
    "104": "Numpad8",
    "105": "Numpad9",
    "106": "NumpadMultiply",
    "107": "NumpadAdd",
    "108": "NumpadEnter",
    "109": "NumpadSubtract",
    "110": "NumpadDecimal",
    "111": "NumpadDivide",
    "112": "F1",
    "113": "F2",          // NOTE: can't capture on my Mac
    "114": "F3",          // NOTE: can't capture on my Mac
    "115": "F4",
    "116": "F5",
    "117": "F6",
    "118": "F7",
    "119": "F8",
    "120": "F9",
    "121": "F10",
    "122": "F11",
    "123": "F12",
    "124": "F13",
    "125": "F14",
    "126": "F15",          // NOTE: can't capture on my Mac
    "127": "F16",
    "128": "F17",
    "129": "F18",
    "130": "F19",
    "145": "F14",         // firefox mac
    "173": "Minus",				// firefox mac
    "186": "Semicolon",		// chrome, safari mac
    "187": "Equal",				// chrome, safari mac
    "188": "Comma",
    "189": "Minus",				// safari mac
    "190": "Period",
    "191": "Slash",
    "192": "Backquote",
    "219": "BracketLeft",
    "220": "Backslash",
    "221": "BracketRight",
    "222": "Quote",
    "224": "Meta"
  };



  //////////////////////////////
  //  Focus Events
  //////////////////////////////

  static _captureFocus(event) {
    // Was this a focus on the WINDOW?
    if (event.target === window) return OakEvent._windowFocus(event);
    // Ignore focus/blur on the document (which FF sends as a redundant event)
    if (event.target === document) return;
    // Focus on another element
    return OakEvent._elementFocus(event);
  }

  static _windowFocus(event) {
  // console.group("WindowFocus");
  // console.dir(event);
  // console.groupEnd();

    const oakEvent = app.event.clone({
      type: "windowFocus"
    });
    app.setEvent(oakEvent, event);
  }

  static _elementFocus(event) {
    const oakEvent = app.event.clone({
      type: "focus",
      focused: event.target
    });
    app.setEvent(oakEvent, event);
  }


  //////////////////////////////
  //  Blur Events
  //////////////////////////////

  static _captureBlur(event) {
    // Was this a blur on the WINDOW?
    if (event.target === window) return OakEvent._windowBlur(event);
    // Ignore focus/blur on the document (which FF sends as a redundant event)
    if (event.target === document) return;
    // Blur on another element
    return OakEvent._elementBlur(event);
  }


  static _windowBlur(event) {
  // console.group("WindowBlur");
  // console.dir(event);
  // console.groupEnd();

    const oakEvent = app.event.clone({
      type: "windowBlur"
    });

    // When the window blurs, clear all key data INCLUDING keyMaps,
    // because we can't track what keys go up when window is not focused.
    oakEvent._clearKeyMap();
    oakEvent._clearKeyData();

    app.setEvent(oakEvent, event);
  }

  static _elementBlur(event) {
    const oakEvent = app.event.clone({
      type: "blur"
    });
    app.setEvent(oakEvent, event);

    // clear focused data on a timeout so we remember it during this event
    setTimeout(function() {
      const oakEvent = app.event.clone({ type: "_blur" });
      delete oakEvent.focused;
      app.setEvent(oakEvent);
    }, 0);
  }



  //////////////////////////////
  //  Debug
  //////////////////////////////

  // Add events here to suppress automatic log of their events
  static SUPPRESS_LOG = {
    mousemove: true
  }

  // Log this event the console.
  _log() {
    if (OakEvent.SUPPRESS_LOG[this.type]) return;

    // actual object properties
    const values = Object.keys(this).map( key => {
      if (key.startsWith("_")) return;

      let value = this[key];
      if (value === undefined) return;

      if (value instanceof Element) value = "<"+value.tagName+">";

      return key + ":" + value;
    }).filter(Boolean);

    // mouse specials
    if (this.isDragging) {
      values.push("dragRect:"+this.dragRect);
    }

    // key specials
    const keys = Object.keys(this.keys).join(",");
    if (keys) values.push("keys:"+ keys);

    console.log(values.join("  "));
  }


  //////////////////////////////
  //  Static initializer, called on document.ready
  //////////////////////////////

  static initialize() {
    console.info("initializing events");

    // mouse event capture
    document.addEventListener("mousemove", OakEvent._captureMouseMove, true);
    document.addEventListener("mousedown", OakEvent._captureMouseDown, true);
    document.addEventListener("mouseup", OakEvent._captureMouseUp, true);

    // keyboard event capture
    document.addEventListener("keydown", OakEvent._captureKeydown, true);
    document.addEventListener("keyup", OakEvent._captureKeyup, true);

    // window focus event capture
    window.addEventListener("focus", OakEvent._captureFocus, true);
    window.addEventListener("blur", OakEvent._captureBlur, true);

    // Create a new empty event to start.
    app.setEvent( new OakEvent({ type: "init" }) );
  }


} // end class OakEvent


$(document).ready( OakEvent.initialize );

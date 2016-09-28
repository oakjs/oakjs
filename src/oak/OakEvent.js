//////////////////////////////
//
//  Event normalization
//
//  Watch keyboard and mouse events BEFORE they go to the normal elements
//  so we can report on the current state of things regardless of whether
//  processing is happening within an event or not.
//
//  Access `oak.event.*` to figure out the current state of the world, eg:
//    - oak.event.button
//    - oak.event.pageLoc
//  etc.
//
//  TODO: make generic (roots only?)
//  TODO: rename EventMonitor ?
//
//////////////////////////////


import Action from "oak-roots/Action";
import Point from "oak-roots/Point";
import Rect from "oak-roots/Rect";

import oak from "./oak";

export default class OakEvent {

//  Window geometry:
//    NOTE: these ARE NOT affected by window zoom!
//    - windowSize      Current size of the window
//    - scrollLoc       Current <body> scroll
//
//  Current mouse coordinates:
//    NOTE: these ARE affected by window zoom!
//    - pageLoc         Current mouse coordinate WITH SCROLL
//    - clientLoc       Current mouse coordinate WITHOUT SCROLL
//    - target          Current element under the mouse (including <SelectionOverlay>)
//    - mouseTarget     Current element under the mouse (NOT including <SelectionOverlay>)
//
//  Mouse Button
//    NOTE: only "left" mouse button is fully supported, see `_captureMouseDown()`
//    - button          If mouse down:  "left", "right" or "wheel"
//    - anyButtonDown   `true` if any mouse button is down.
//    - leftButtonDown  `true` if "left" mouse button is down.
//
//  Mouse down / dragging:
//    - isDragging      Has a drag been initiated?  (MouseDown + mouse move required)
//    - downPageLoc     If left mouse down: Mousedown coordinate WITH SCROLL
//    - downClientLoc   If left mouse down: Mousedown coordinate WITHOUT SCROLL
//    - downTarget      If left mouse down: Element underneath the mouse on mousedown.
//    - dragDelta       If left mouse down: Delta between mouseDown and current mouse position.
//    - dragDirection   If left mouse down: Direction of movement since mousedown.
//    - dragPageRect    If left mouse down: Rectangle from mouseDown to current position INCLUDING SCROLL.
//    - dragClientRect  If left mouse down: Rectangle from mouseDown to current position WITHOUT SCROLL.
//
//  Context Menu:
//    - menuTarget      If right mouse down: Element underneath the mouse on mousedown.
//
//  Keyboard
//    NOTE: The `CapsLock` key is not included in `keys` or `keyIds` as it's not reliable.
//    - keys            Map of all NAMES of all keys currently down, eg: `{ Shift, A }`
//    - keyIds          Map of all IDS of all keys currently down, eg: `{ ShiftLeft, KeyA }`
//    - altKey          `true` if the `Alt` key is down.
//    - metaKey         `true` if the `Meta` or `OS` key is down.
//    - shiftKey        `true` if the `Shift` key is down.
//    - controlKey      `true` if the `Control` key is down.
//
//    - optionKey       Macintosh alias for `altKey`.
//    - commandKey      Macintosh alias for `metaKey`.


  constructor(props) {
    Object.assign(this, props);
  }

  // Return a clone of this event.
  clone(...props) {
    const clone = new OakEvent(this);
    props.forEach( props => Object.assign(clone, props) );
    return clone;
  }


  //////////////////////////////
  // Window geometry
  //////////////////////////////

  // Return the current `<body>` scroll as a `Point`.
  // NOTE: this is NOT affected by body zoom!
  get scrollLoc() { return OakEvent.scrollLoc }
  static get scrollLoc() {
    return new Point(window.scrollX, window.scrollY);
  }

  // Return the window INNER size as a `Point`.
  // NOTE: this is NOT affected by body zoom!
  get windowSize() { return OakEvent.windowSize }
  static get windowSize() {
    return new Point(window.innerWidth, window.innerHeight);
  }


  //////////////////////////////
  // Button sugar
  //////////////////////////////

  // Is ANY button down?
  // NOTE: This is not totally reliable yet, but use it and hopefully we'll figure it out.
  get anyButtonDown() {
    return this.button !== undefined;
  }

  // Is the LEFT button down.
  // NOTE: NOT true if the right button is down.
  get leftButtonDown() {
    return this.button === "left";
  }

  //////////////////////////////
  // Dragging sugar
  //////////////////////////////

  // Delta between current mouse location and last mouse down event.
  // Returns `undefined` if mouse is not down.
  get dragDelta() {
    return this.downPageLoc && this.pageLoc.delta(this.downPageLoc);
  }

  // Direction of drag.
  // Returns `undefined` if mouse is not down.
  get dragDirection() {
    return this.dragDelta && this.dragDelta.direction;
  }

  // (Sorted) rectangle for current drag INCLUDING BODY SCROLL.
  // Returns `undefined` if mouse is not down.
  get dragPageRect() {
    if (!this.downPageLoc) return undefined;
    return Rect.rectFromPoints(this.downPageLoc, this.pageLoc);
  }

  // (Sorted) rectangle for current drag NOT INCLUDING BODY SCROLL.
  // Returns `undefined` if mouse is not down.
  // NOTE: not accurate if window is zoomed while the mouse is down...
  get dragClientRect() {
    const pageRect = this.dragPageRect;
    if (pageRect) return pageRect.offset(OakEvent.scrollLoc.invert());
  }

  //////////////////////////////
  // OID Element detection
  //////////////////////////////

  // DOM Element under the mouse, NOT including the `SelectionOverlay`.
  // NOTE: this is pretty expensive to calculate...
  // NOTE: this can be called at any time, as it's based on the stored `event.clientLoc`.
  get mouseTarget() {
    if (oak.event) return OakEvent._getTopElement(oak.event.clientLoc);
  }

  // DOM Element under the mouse when the mouse went down, NOT including the `SelectionOverlay`.
  // NOTE: this is pretty expensive to calculate...
  // NOTE: this can be called at any time, as it's based on the stored `event.clientLoc`.
  get downTarget() {
    if (oak.event) return OakEvent._getTopElement(oak.event.downClientLoc);
  }

  // Return the top-most element under the mouse NOT including the `#SelectionOverlay` layer.
  // Returns `undefined` if we can't figure it out.
  //
  // NOTE: this is expensive to figure out, as it references, and possibly manipulates, the DOM.
//TODO: refactor out the `#SelectionOverlay` stuff somehow...
  static _getTopElement(clientLoc) {
    if (!clientLoc) return undefined;

    // hide SelectionOverlay so it doesn't mask the page
    const selectionOverlay = document.querySelector("#SelectionOverlay");
    if (selectionOverlay) selectionOverlay.style.display = "none";

    const target = document.elementFromPoint(clientLoc.x, clientLoc.y) || undefined;

    // restore SelectionOverlay
    if (selectionOverlay) selectionOverlay.style.display = "";

    return target;
  }


  //////////////////////////////
  //  Mouse Move Event
  //////////////////////////////

  static MOUSE_DRAG_MIN_SIZE = 5;

  // Return mouse position for some `MouseEvent`.
  // - `pageLoc` DOES include <body> scroll
  // - `clientLoc` DOES NOT include <body> scroll (window geometry only)
  static getPageLoc(mouseEvent) { return new Point(mouseEvent.pageX, mouseEvent.pageY) }
  static getClientLoc(mouseEvent) { return new Point(mouseEvent.clientX, mouseEvent.clientY) }


  static _captureMouseMove(event) {
    const mouseInfo = OakEvent._getMouseInfo(event, "SKIP_IF_NO_MOVE");
    if (!mouseInfo) return;

    const oakEvent = oak.event.clone({ type: "mousemove" }, mouseInfo)

    // If the mouse is down for the primary mouse button:
    if (oakEvent.leftButtonDown) {
      // Start "isDragging" if mouse has moved at least 5 pixels since mousedown.
      if (!oakEvent.isDragging && oakEvent.dragDelta) {
// TODO: generate an event?
        oakEvent.isDragging = (oakEvent.dragDelta.size > OakEvent.MOUSE_DRAG_MIN_SIZE);
      }
    }
    oak.setEvent(oakEvent, event);
  }

  //////////////////////////////
  //  Mouse Down Event
  //////////////////////////////

  static _captureMouseDown(event) {
    const mouseInfo = OakEvent._getMouseInfo(event);
    if (!mouseInfo) return;

    // Capture mouse position no matter which button went down.
    // Necessary because a scroll or resize might have changed the logical position.
    const oakEvent = oak.event.clone(mouseInfo);
    // clear mouseDown data (shouldn't need to, but...)
    oakEvent._clearMouseDownData();

    // Do different things based on which button was pressed.
    const button = OakEvent._getMouseButton(event);
    if (button === "left") {
      oakEvent.type = "mousedown";
      oakEvent.downPageLoc = oakEvent.pageLoc;
      oakEvent.downClientLoc = oakEvent.clientLoc;
      oakEvent.button = button;
    }
    else if (button === "right") {
      oakEvent.type = "contextmenu";
      oakEvent.menuTarget = oakEvent.mouseTarget;
      // NOTE: We can't reliably know when the right mouse button goes UP,
      //       so we do NOT record the button name.
      // oakEvent.button = button;
    }
    else {
      console.error(`OakEvent._captureMouseDown( { button:${event.button} }): button not (yet) supported`, event);
      return;
    }

    oak.setEvent(oakEvent, event);
  }

  // Clear event data set on mouseDown.
  _clearMouseDownData() {
    delete this.button;
    delete this.downClientLoc;
    delete this.downPageLoc;
    delete this.isDragging;
    delete this.menuTarget;
  }

  //////////////////////////////
  //  Mouse Up Event
  //////////////////////////////

  static _captureMouseUp(event) {
    const oakEvent = oak.event.clone({
      type: "mouseup"
    });
    oak.setEvent(oakEvent, event);

    // clear mousedown data on a timeout so we remember it during this event
    setTimeout(function() {
      const oakEvent = oak.event.clone({ type: "_mouseup" });
      oakEvent._clearMouseDownData();
      oak.setEvent(oakEvent);
    }, 0);
  }


  //////////////////////////////
  //  Dragging support
  //////////////////////////////

  // Initialize a set of drag handlers from a `mouseDown` event:
  //  - `onDragStart` will be called once when they actually start moving
  //  - `onDrag` will be called on mousemove while dragging
  //  - `onDragEnd` will be called once when the mouse goes up whether we were dragging or not.
  //
  //  - if `preventDefault` is truthy, we'll `event.preventDefault()` for mouse down / move / up.
  //  - if `stopPropagation` is truthy, we'll `event.stopPropagation()` for mouse down / move / up.
  //
  // You can pass functions, or the string name of an event to trigger on `oak`.
//TODO: If we can update mouseLoc on scroll/resize, generate additional drag events
//TODO: When cursor is in bottom of page, auto-scroll ???
//TODO: return a promise which resolve/rejects so you can just watch that?
  initDragHandlers(options) {
    let {
      event,          // optional: mouseDown event
      flag,           // optional: `oak.event[flag]` will be `true` when we're doing this interaction
                      // optional: mouse event handlers
      onDragStart = Function.prototype,
      onDrag = Function.prototype,
      onDragEnd = Function.prototype,
                      // optional: handler to get `info` object when dragging
      getDragInfo = Function.prototype,
                      // don't pass events by default
      preventDefault = true, stopPropagation = true
      //
    } = options;

    // Flag which will be true while we're actually dragging
    let _draggingStarted = false;
    const onMouseMove = (event) => {
      // forget it if they haven't dragged the minimum number of pixels
      if (!oak.event.isDragging) return;

      // stop propagation on current event if specified
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();

      // get `info` for the current drag
      const dragInfo = getDragInfo(event);

      // If we haven't started dragging
      if (!_draggingStarted) {
        if (flag) oak.event[flag] = true;

        _draggingStarted = true;
        // call dragStart first
      // TODO: try...catch
        onDragStart(event, dragInfo);
      }

      // call onDrag each time
      // TODO: try...catch
      onDrag(event, dragInfo);
    }

    const onMouseUp = (event) => {
      // turn handlers off FIRST
      $(document).off("mousemove", onMouseMove);
      $(document).off("mouseup", onMouseUp);
      $(document).off("scroll", onMouseMove);

      // stop propagation on current event if specified
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();

      const dragInfo = _draggingStarted ? getDragInfo(event) : undefined;

      // call `onDragEnd` whether dragging happened or not
      // TODO:  try...catch
      onDragEnd(event, dragInfo);

      // unset flag AFTER onDragEnd
      if (flag) delete oak.event[flag];
    }

    // watch mousemove and mouseup with the handlers above
    $(document).on("mousemove", onMouseMove);
    $(document).on("mouseup", onMouseUp);

    // treat a window scroll like a mouseMove
    $(document).on("scroll", onMouseMove);

    // stop propagation on current event if specified
    if (event && preventDefault) event.preventDefault();
    if (event && stopPropagation) event.stopPropagation();
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

  // Return info about the mouse position / etc
  //  - pageLoc     Current mouse position INCLUDING SCROLL
  //  - clientLoc   Current mouse position NOT INCLUDING SCROLL
  //  - target      Element under the mouse
  //
  // NOTE:  If this is a mouseMove and there was no actual movement,
  //        we return `undefined` immediately.  This works around a bug
  //        in Chrome Mac which fires `mousemove` repeatedly because we're
  //        manipulating the DOM in `_getNonSelectionOverlayTarget()`.
  //
  static _getMouseInfo(event) {
    return {
      pageLoc: OakEvent.getPageLoc(event),
      clientLoc: OakEvent.getClientLoc(event),
      target: event.target,
    }
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

    const oakEvent = oak.event.clone({
      type: "keydown",
      key,
      keyId
    });

    // Accumulate keys which are currently down in `keys` and `keyIds`
    // NOTE: We don't get a normal key up event for CapsLock, so we can't reliably work with it.
    if (key !== "CapsLock") {
      oakEvent._addToKeyMap(key, keyId);

      // If the meta/command-key is down:
      if (oak.event.keys.Meta) {
        //  If they're typing another key
        //  turn that other key off on an immediate timeout.
        //  This works around bugs on FF Mac (at least) where we don't get a key up
        //  event for some command keys, which causes `keys` and `keyIds` to be off.
        if (!["Meta","Shift","Alt","Control"].includes(key)) {
          setTimeout(function() {
            const oakEvent = oak.event.clone({ type: "_keyup" });
            oakEvent._removeFromKeyMap(key, keyId);
            oak.setEvent(oakEvent);
          }, 0);
        }
      }
    }

    oak.setEvent(oakEvent, event);

    // Have `Action` fire any active key events.
    const actionFired = Action.fireMatchingAction(oakEvent.keys, !!oakEvent.focused);
    if (actionFired) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  //////////////////////////////
  //  Key Up Event
  //////////////////////////////

  static _captureKeyup(event) {
    const key = OakEvent.keyForEvent(event);
    const keyId = event.code;

    const oakEvent = oak.event.clone({
      type: "keyup",
      key,
      keyId
    });

    // remove from key maps immediately so we can detect the current state
    oakEvent._removeFromKeyMap(key, keyId);

    oak.setEvent(oakEvent, event);

    // clear current key data on a timeout so we remember it during this event
    setTimeout(function() {
      const oakEvent = oak.event.clone({ type: "_keyup" });
      oakEvent._clearKeyData();
      oak.setEvent(oakEvent);
    }, 0);
  }

  _clearKeyData() {
    delete this.key;
    delete this.keyId;
  }

  //////////////////////////////
  //  Global key maps
  //
  //  You can access these maps to figure out ALL the keys that are currently down.
  //  Access as:  `oak.event.keys.Meta` or `oak.event.keyIds.KeyA`
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
    "59": "Semicolon",    // firefox mac
    "61": "Equal",        // firefox mac
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
    "173": "Minus",        // firefox mac
    "186": "Semicolon",    // chrome, safari mac
    "187": "Equal",        // chrome, safari mac
    "188": "Comma",
    "189": "Minus",        // safari mac
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

    const oakEvent = oak.event.clone({
      type: "windowFocus"
    });
    oak.setEvent(oakEvent, event);
  }

  static _elementFocus(event) {
    const oakEvent = oak.event.clone({
      type: "focus",
      focused: event.target
    });
    oak.setEvent(oakEvent, event);
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

    const oakEvent = oak.event.clone({
      type: "windowBlur"
    });

    // When the window blurs, clear all key data INCLUDING keyMaps,
    // because we can't track what keys go up when window is not focused.
    oakEvent._clearKeyMap();
    oakEvent._clearKeyData();

    oak.setEvent(oakEvent, event);
  }

  static _elementBlur(event) {
    // if focused element hasn't changed, clear focused on a timeout
    //  so we remember it during this blur event
    const currentFocused = oak.event.focused;
    setTimeout(function() {
      if (oak.event.focused === currentFocused) {
        const oakEvent = oak.event.clone({ type: "_blur" });
        delete oakEvent.focused;
        oak.setEvent(oakEvent);
      }
    }, 0);

    // fire the normal blur event
    const oakEvent = oak.event.clone({
      type: "blur"
    });
    oak.setEvent(oakEvent, event);
  }


  //////////////////////////////
  //  Window zoom
  //////////////////////////////

  // Delay after which we check for `zoom` events.
  static CHECK_ZOOM_DELAY = 150;

  // Return the current `devicePixelRatio` of the window.
  // NOTE: this is notoriously unreliable, we just use it to detect if the zoom changes.
  get devicePixelRatio() { return OakEvent.devicePixelRatio }
  static get devicePixelRatio() {
    return window.devicePixelRatio || 1;
  }

  // Return the current `zoom` of the window.
  // NOTE: this is notoriously unreliable, we just use it to detect if the zoom changes.
  get zoom() { return OakEvent.zoom }
  static get zoom() {
    return 1 / OakEvent.devicePixelRatio;
  }

  // Capture window `resize` event.
  static _captureResize(event) {}

  // Capture document `zoom` event (which we generate -- see `initializeEvents()`.
  static _captureZoom(event) {}

  // Capture document `scroll` event.
  static _captureScroll(event) {
    const lastScroll = OakEvent.__lastScrollLoc;
    const scroll = OakEvent.__lastScrollLoc = OakEvent.scrollLoc;

    const oakEvent = oak.event.clone({
      type: "scroll"
    });

    // update the pageLoc based on the scroll delta, if we can
    if (lastScroll) {
      const delta = scroll.delta(lastScroll);
      if (oak.event.pageLoc) oakEvent.pageLoc = oak.event.pageLoc.add(delta);
    }

    oak.setEvent(oakEvent, event);
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////

  // Add events here to suppress automatic log of their events
  static LOG_EVENTS = {}

  // Log this event the console.
  _log(force) {
    if (!OakEvent.LOG_EVENTS[this.type] || !force) return;

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
      values.push("dragPageRect:"+this.dragPageRect);
    }

    // key specials
    const keys = Object.keys(this.keys).join(",");
    if (keys) values.push("keys:"+ keys);

    console.log(values.join("  "));
  }


  //////////////////////////////
  //  Static initializer, called on document.ready
  //////////////////////////////


  static initializeEvents() {
//    console.info("initializing events");

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

    // Window geometry event capture
    document.addEventListener("scroll", OakEvent._captureScroll, true);
    document.addEventListener("zoom", OakEvent._captureZoom, true);
    window.addEventListener("resize", OakEvent._captureResize, true);

    // set a timer to attempt to detect devicePixelRatio changes
    // which we'll use to fire a "zoom" event
    let _lastDevicePixelRatio = OakEvent.devicePixelRatio;
    function _checkWindowZoom() {
      if (OakEvent.devicePixelRatio !== _lastDevicePixelRatio) {
        _lastDevicePixelRatio = OakEvent.devicePixelRatio;
        $(document).trigger("zoom");
      }
    }
    setInterval(_checkWindowZoom, OakEvent.CHECK_ZOOM_DELAY);

    // Create a new empty event to start.
    oak.setEvent( new OakEvent({ type: "init" }) );
  }


} // end class OakEvent


// Fire our `initializeEvents` method when the document is ready.
$(document).ready( OakEvent.initializeEvents );

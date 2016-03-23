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

var _SelectionOverlay;

// Initialize events when the document is ready
$(document).ready( function() {
  console.info("initializing events");

  _SelectionOverlay = document.querySelector("#SelectionOverlay");

  // mouse event capture
  document.addEventListener("mousemove", _captureMouseMove, true);
  document.addEventListener("mousedown", _captureMouseDown, true);
  document.addEventListener("mouseup", _captureMouseUp, true);

  // keyboard event capture
  document.addEventListener("keydown", _captureKeydown, true);
  document.addEventListener("keyup", _captureKeyup, true);

  // window focus event capture
  window.addEventListener("focus", _captureFocus, true);
  window.addEventListener("blur", _captureBlur, true);

});


class AppEventReport {

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
    const clone = new AppEventReport(this);
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
    return this._getClosestOid(this.mouseTarget);
  }

  // Editable component under the mouse
  get mouseComponent() {
    return app.getComponentForOid(this._mouseOid);
  }

  // OID Element under the mouse when mouse went down
  get _downOid() {
    return this._getClosestOid(this.downTarget);
  }

  // Editable component when the mouse wend down.
  get downComponent() {
    return app.getComponentForOid(this._downOid);
  }

  // Return the `oid` of the closest element with a `data-oid` attribute to the `target` element.
  _getClosestOid(target) {
    if (target) {
      const oidTarget = roots.elements.closestMatching(target, "[data-oid]");
      if (oidTarget) return oidTarget.getAttribute("data-oid");
    }
    return undefined;
  }


  //////////////////////////////
  // Keyboard sugar -- NOTE: this ONLY reflect the current state
  //////////////////////////////

  // the definitive set of ALL the keys that are down right now
  static keys = {};
  static keyIds = {};

  get keys() { return AppEventReport.keys }
  get keyIds() { return AppEventReport.keyIds }

  // Are the modifier keys currently down?
  get altKey() { return !!this.keys.Alt }
  get metaKey() { return !!this.keys.Meta }
  get shiftKey() { return !!this.keys.Shift }
  get controlKey() { return !!this.keys.Control }

  // mac alternatives
  get optionKey() { return !!this.keys.Alt }
  get commandKey() { return !!this.keys.Meta }


}



//////////////////////////////
//  Mouse events
//////////////////////////////

const MOUSE_DRAG_MIN_SIZE = 5;

function _captureMouseMove(event) {
  const mouseLoc = new Point(event.pageX, event.pageY);
  const lastMouseLoc = app.event.mouseLoc;

  // Only run the event if the mouse has actually moved.
  // This works around a big in Chrome Mac where it fires `mousemove` repeatedly
  //  because we're manipulating the DOM in `_getMouseTarget()`.
  if (mouseLoc.equals(lastMouseLoc)) return;

  // Modify a clone of the last event.
  const eventReport = app.event.clone({
    type: "mousemove",

    // Current position of the mouse.
    mouseLoc,

    // Position of the mouse last time.
    _lastMouseLoc: lastMouseLoc,

    // Current DOM element under the mouse.
    mouseTarget: _getMouseTarget(event),

  });

  // If the mouse is down for the primary mouse button:
  if (eventReport.button === "left") {
    // Start "dragging" if mouse has moved at least 5 pixels since mousedown.
    if (eventReport.downLoc && !eventReport.dragging) {
      eventReport.dragging = (eventReport.downLoc.size > MOUSE_DRAG_MIN_SIZE);
    }
  }

  app.setEvent(eventReport);
}

function _captureMouseDown(event) {
  // which button is being pressed?
// TODO: doesn't handle multiple buttons at once, nor fingers...
  let button = (event.buttons ? event.button : undefined);
  if (event.button === 0) app.event.button = "left";
  else if (event.button === 1) app.event.button = "wheel";
  else if (event.button === 2) app.event.button = "right";

  // Modify a clone of the last event.
  const eventReport = app.event.clone({
    type: "mousedown",

    // Current button being pressed.
    button,

    // Location where the mouse went down.
    downLoc: new Point(event.pageX, event.pageY),

    // Current DOM element under the mouse
    downTarget: _getMouseTarget(event),
  });

  app.setEvent(eventReport);
}

function _captureMouseUp(event) {
  const eventReport = app.event.clone({
    type: "mouseup"
  });
  app.setEvent(eventReport);

  // clear mousedown data on a timeout so we remember it during this event
  setTimeout(function() {
    const eventReport = app.event.clone({ type: "_mouseupCompleted" });

    delete eventReport.button;
    delete eventReport.downLoc;
    delete eventReport.downTarget;
    delete eventReport.dragging;

    app.setEvent(eventReport);
  }, 0);
}


// Return the target under the mouse NOT including the selection layer
function _getMouseTarget(event) {
  if (!_SelectionOverlay) return event.target;

  // hide SelectionOverlay so it doesn't mask the page
  const originalDisplay = _SelectionOverlay.style.display;
  if (originalDisplay !== "none") _SelectionOverlay.style.display = "none";

  const target = document.elementFromPoint(event.clientX, event.clientY);

  // restore SelectionOverlay
  if (originalDisplay !== "none") _SelectionOverlay.style.display = originalDisplay;
  return target;
}


//////////////////////////////
//  Key events
//
// NOTE: Attempting to use `event.code` to normalize keyboards across browsers.
//       NOT SUPPORTED IN IE or SAFARI!  :-(
// see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
//
//////////////////////////////

function _captureKeydown(event) {
  const key = keyForEvent(event);
  const keyId = event.code;

  const eventReport = app.event.clone({
    type: "keydown",
    key,
    keyId
  });

  // Accumulate keys which are currently down in `keys` and `keyIds`
  // NOTE: We don't get a normal key up event for CapsLock, so we can't reliably work with it.
  if (key !== "CapsLock") {
    _addToKeyMap(key, keyId);

    // If the command-key is down:
    if (app.event.keys.Meta) {
      //  If they're typing another key
      //  turn that other key off on an immediate timeout.
      //  This works around bugs on FF Mac (at least) where we don't get a key up
      //  event for some command keys, which causes `keys` and `keyIds` to be off.
      if (!["Meta","Shift","Alt","Control"].includes(key)) {
        setTimeout(function() {
          _removeFromKeyMap(key, keyId);
        }, 0);
      }
    }
  }

  app.setEvent(eventReport);

// DEBUG
//  event.preventDefault();
}

function _captureKeyup(event) {
  const key = keyForEvent(event);
  const keyId = event.code;

  _removeFromKeyMap(key, keyId);

  const eventReport = app.event.clone({
    type: "keyup",
    key,
    keyId
  });

  app.setEvent(eventReport);

  // clear current key data on a timeout so we remember it during this event
  setTimeout(function() {
    const eventReport = app.event.clone({ type: "_keyupCompleted" });
    delete eventReport.key;
    delete eventReport.keyId;
    app.setEvent(eventReport);
  }, 0);
}

function _addToKeyMap(key, keyId) {
  AppEventReport.keys[key] = true;
  AppEventReport.keyIds[keyId] = true;
}

function _removeFromKeyMap(key, keyId) {
  delete AppEventReport.keys[key];
  delete AppEventReport.keyIds[keyId];
}

function _clearKeyMap() {
  Object.keys(AppEventReport.keys).forEach(key => delete AppEventReport.keys[key]);
  Object.keys(AppEventReport.keyIds).forEach(key => delete AppEventReport.keyIds[key]);
}

function keyForEvent(event) {
  return KEY_CODE_TO_KEY_MAP[event.keyCode]
      || String.fromCharCode(event.keyCode).toUpperCase();
}


// Map for numeric key code to logical key name.
// TESTED FOR US KEYBOARDS ON MAC ONLY!!!!
const KEY_CODE_TO_KEY_MAP = {
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
//  Window focus / blur
//////////////////////////////

function _captureFocus(event) {
  console.warn("window focus", event);
}

function _captureBlur(event) {
  console.warn("window blur", event);
}



//////////////////////////////
//  Debug
//////////////////////////////

function _logEvent(eventReport) {
  // actual object properties
  const values = Object.keys(eventReport).map( key => {
    if (key.startsWith("_")) return;

    let value = eventReport[key];
    if (value === undefined) return;

    if (value instanceof Element) value = "<"+value.tagName+">";

    return key + ":" + value;
  }).filter(Boolean);

  // mouse specials

  // key specials
  const keys = Object.keys(eventReport.keys).join(",");
  if (keys) values.push("keys:"+ keys);

  console.log(values.join("  "));
}



function _logMouseEvent(eventName) {
  const msg = [eventName+":"]
  for (let key in app.event) {
    var value = app.event[key];
    if (key === "keys" || key === "keyIds") continue;
    if (value !== undefined) msg.push(key+":"+value);
  }

  if (app.event.moveDelta) {
    const moveDirection = Object.keys(app.event.moveDirection).join(",");
    if (moveDirection) msg.push("moveDirection:"+moveDirection);
  }

  if (app.event.button) {
    if (app.event.dragging) msg.push("dragging");
    msg.push("dragDelta:"+app.event.dragDelta);
    if (app.event.dragDirection) {
      msg.push("dragDirection:"+ Object.keys(app.event.dragDirection).join(","));
    }
  }

  console.log(msg.join("  "));
}




//////////////////////////////
//  App functionality
//////////////////////////////


// Set the current event.
// TODO: is this a trigger ????
app.setEvent = function(eventReport) {
  app.event = eventReport;
  _logEvent(eventReport);
}

// Create a new empty event to start.
app.setEvent( new AppEventReport({ type: "init" }) );




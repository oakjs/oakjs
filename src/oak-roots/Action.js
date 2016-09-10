//////////////////////////////
// Action class -- encapsulates an end-user callable action
//  for use in menus and buttons
//////////////////////////////

import { proto } from "oak-roots/util/decorators";
import { dieIfMissing } from "oak-roots/util/die";


function defineGetter(action, key, expression) {
  const getter = (typeof expression === "function" ? expression : function(){ return expression });
  Object.defineProperty(action, key, {
    get: getter,
    enumerable: true,
    configurable: true
  });
}

export default class Action {
  // Id of this action, this is how you refer to it from an ActionItem or ActionButton
  @proto
  id = undefined;

  // Handler function to execute when action is called.
  @proto
  handler = Function.prototype;

  // Action title.
  // Can be overridden in ActionItem or ActionButton.
  // Pass a string or an expression to be dynamically evaluated.
  get title() { return "Untitled Action" }
  set title(expression) { defineGetter(this, "title", expression) }

  // Keyboard shortcut for the action.
  // Can be overridden in ActionItem or ActionButton.
//REFACTOR: PC & Mac specific keys?
//REFACTOR: auto-split for multiple shortcuts?
  @proto
  shortcut = undefined

  // Whether this action is currently hidden.
  // Pass an expression to be dynamically evaluated.
  get hidden() { return false }
  set hidden(expression) { defineGetter(this, "hidden", expression) }

  // Whether this action is currently disabled.
  // Pass an expression to be dynamically evaluated.
  get disabled() { return false }
  set disabled(expression) { defineGetter(this, "disabled", expression) }

  // Whether this action is currently checked.
  // Pass an expression to be dynamically evaluated.
  get checked() { return false }
  set checked(expression) { defineGetter(this, "checked", expression) }

  // Whether this action should fire when focused in an input field.
  // Pass `true` to enable the action when focused.
  @proto
  whenFocused = false;

  constructor(props, skipRegistration) {
    dieIfMissing(props, "new Action", ["id", "handler"]);
    Object.assign(this, props);

    // normalize shortcut to an array
    if (typeof this.shortcut === "string") this.shortcut = this.shortcut.split(" ");

    // Register this action
    if (!skipRegistration) Action.register(this);
  }

  // Clone an action, adding `props` passed in to the clone.
  // Does NOT register the clone globally!
  clone(props) {
    return new (this.constructor)({ ...this, ...props }, "SKIP_REGISTRATION");
  }

  // Execute the action.
  // NOTE: we late-bind the `handler` to the action,
  //  so we'll pick up any instance-specific props assigned when the action was created.
  get execute() {
    return this.handler.bind(this);
  }

  // Does this action's `shortcut` match all of the specified `keys`?
  // On sucess, returns array of keys matched.
  // If: no match, disabled, not hidden, or `isFocused` doesn't match `whenFocused`, returns `undefined`.
  matchKeys(keys, isFocused) {
    if (!this.shortcut) return;
    if (this.hidden) return;
    if (this.disabled) return;
    if (isFocused && !this.whenFocused) return;

  //REFACTOR: multiple shortcuts?
    // return list of shortcuts if ALL are found in `keys`
    if (this.shortcut.every(key => keys[key])) return this.shortcut;
  }

  // Return hint for shortcut as shown in menus.
  static SHORTCUT_KEY_HINTS = {
    "Alt":                "⎇",
    "Backquote":          "`",
    "Backslash":          "\\",
    "Backspace":          "⌫",
    "BracketLeft":        "]",
    "BracketRight":       "[",
    "Comma":              ",",
    "Control":            "^",
    "Delete":             "⌦",
    "Down":               "↓",
    "End":                "end",
    "Enter":              "↵",
    "Equal":              "=",
    "Escape":             "esc",
    "Home":               "home",
    "Left":               "←",
    "Meta":               "⌘",
    "Minus":              "-",
    "Numlock":            "clear",
    "Numpad0":            "NUM0",
    "Numpad1":            "NUM1",
    "Numpad2":            "NUM2",
    "Numpad3":            "NUM3",
    "Numpad4":            "NUM4",
    "Numpad5":            "NUM5",
    "Numpad6":            "NUM6",
    "Numpad7":            "NUM7",
    "Numpad8":            "NUM8",
    "Numpad9":            "NUM9",
    "NumpadAdd":          "NUM+",
    "NumpadDecimal":      "NUM.",
    "NumpadDivide":       "NUM\\",
    "NumpadEnter":        "NUM↵",
    "NumpadMultiply":     "NUM*",
    "NumpadSubtract":     "NUM-",
    "PageDown":           "pgDn",
    "PageUp":             "pgUp",
    "Period":             ".",
    "Quote":              "'",
    "Right":              "→",
    "Semicolon":          ";",
    "Shift":              "⇧",
    "Slash":              "/",
    "Space":              "space",
    "Tab":                "tab",
    "Up":                 "↑",
  }

  get shortcutHint() {
    if (!this.shortcut) return "";
    return this.shortcut.map(key => {
      return Action.SHORTCUT_KEY_HINTS[key] || key;
    });
  }


//////////////////////////////
//  Static methods / properties
//////////////////////////////

  // Registry of all known actions.
  static REGISTRY = {}

  // Register an action
  static register(action) {
    Action.REGISTRY[action.id] = action;
  }

  // Return an action specified by action `id`.
  // If you pass `props`, we'll clone the object and add the props.
  static get(id, props) {
    const action = Action.REGISTRY[id];
    if (!action) {
      console.warn(`Action.get(${id}): action not found`);
      return undefined;
    }

    if (props) return action.clone(props);
    return action;
  }


  // Registry of all "active" (live) actions.
  static ACTIVE_ACTIONS = {}

  // Activate an action -- make elgible for catching global key events.
  static activate(id) {
    const action = Action.get(id);
    if (action) Action.ACTIVE_ACTIONS[id] = action;
  }

  static deactivate(id) {
    delete Action.ACTIVE_ACTIONS[id];
  }

  // Fire the action that best matches the specified `keys`.
  // Returns `true` if the keys were matched by some action, or `false` if no match.
  // Throws if action raises an error on execution.
  static fireMatchingAction(keys, isFocused) {
    // Figure out the LATEST active action with the LONGEST set of matching keys.
    let bestMatch, bestMatchLength = 0;
    for (let id in Action.ACTIVE_ACTIONS) {
      const action = Action.ACTIVE_ACTIONS[id];
      const match = action.matchKeys(keys, isFocused);
      if (match && match.length >= bestMatchLength) {
        bestMatch = action;
        bestMatchLength = match.length;
      }
    }

    if (!bestMatch) return false;

    try {
      bestMatch.execute();
      return true;
    } catch (e) {
      console.error(`Error firing action ${bestMatch.id}`, e);
      throw e;
    }
  }

}

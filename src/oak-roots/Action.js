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
//REFACTOR: multiple shortcuts?
  @proto
  shortcut = undefined

  // Whether this action is currently visible.
  // Pass an expression to be dynamically evaluated.
  get visible() { return true }
  set visible(expression) { defineGetter(this, "visible", expression) }

  // Whether this action is currently enabled.
  // Pass an expression to be dynamically evaluated.
  get enabled() { return true }
  set enabled(expression) { defineGetter(this, "enabled", expression) }

  // Whether this action is currently checked.
  // Pass an expression to be dynamically evaluated.
  get checked() { return false }
  set checked(expression) { defineGetter(this, "checked", expression) }

  // Whether this action should fire when focused in an input field.
  // Pass `true` to enable the action when focused.
  @proto
  whenFocused = false;

  constructor(props) {
    dieIfMissing(props, "new Action", ["id", "handler"]);
    Object.assign(this, props);

    // Register this action
    Action.register(this);
  }

  // Does this action's `shortcut` match all of the specified `keys`?
  // On sucess, returns array of keys matched.
  // If: no match, disabled, not visible, or `isFocused` doesn't match `whenFocused`, returns `undefined`.
  matchKeys(keys, isFocused) {
    if (!this.shortcut) return;
    if (!this.visible) return;
    if (!this.enabled) return;
    if (isFocused && !this.whenFocused) return;

  //REFACTOR: multiple shortcuts?
    // normalize shortcut to an array
    if (typeof this.shortcut === "string") this.shortcut = this.shortcut.split(" ");
    // return list of shortcuts if ALL are found in `keys`
    if (this.shortcut.every(key => keys[key])) return this.shortcut;
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

  // Return an action specified by id.
  static get(id) {
    const action = Action.REGISTRY[id];
    if (!action) console.warn(`Action.get(${id}): action not found`);
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
      bestMatch.handler();
      return true;
    } catch (e) {
      console.error(`Error firing action ${action.id}`, e);
      throw e;
    }
  }

}

//////////////////////////////
// Cross-browser custom event for Eventful.
// Mimics a subset of the W3C Event interface
//////////////////////////////

export default class CustomEvent {
  constructor(type, props) {
    if (!type) throw new TypeError(`CustomEvent(${type}): invalid type`);
    this.type = type;
    this.timeStamp = Date.now();
    Object.assign(this, props);
    this._state = {};
    Object.freeze(this);
  }

  get currentTarget() { return this.state.currentTarget }
  _setCurrentTarget(target) { this.state.currentTarget = target }

  preventDefault() { this._state.defaultPrevented = true }
  isDefaultPrevented() { return !!_state.defaultPrevented }

  stopPropagation() { this._state.propagationStopped = true }
  isPropagationStopped() { return !!_state.propagationStopped }

  isCustom() { return true }
}

CustomEvent.prototype.bubbles = true;
CustomEvent.prototype.cancelable = true;

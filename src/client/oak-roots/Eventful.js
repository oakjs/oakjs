//////////////////////////////
// Eventful higher-order class.
//////////////////////////////

import CustomEvent from "./CustomEvent";

export default function Eventful(Constructor = Object) {

  return class Eventful extends Constructor {
    // Register to receive a notification for an event.
    //
    // Your handler will be called as:
    //  `handler(eventObject, ...args)`
    // where `...args` are the arguments passed to `trigger()`.
    //
    // NOTE: we will NOT register the same handler twice for the same event.
    on(eventType, handler) {
      const handlers = this._getEventHandlers(eventType, "CREATE");
      if (!handlers.includes(handler)) handlers.push(handler);
    }

    // Remove one or more handlers for an event.
    // If `handler` is undefined, we'll remove ALL notifications for that event.
    // Otherwise we'll just remove the specified handler.
    off(eventType, handler) {
      const handlers = this._getEventHandlers(eventType)
      if (handler === undefined) {
        handlers.splice(0, handlers.length);
      }
      else {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1);
      }
    }

    // Fire a handler for an event exactly once, then unregister it.
    once(eventType, handler) {
      const wrappedHandler = (event, ...args) => {
        try {
          handler(event, ...args);
        }
        finally {
          this.off(handler);
        }
      }
      this.on(eventType, wrappedHandler);
    }

    // Trigger all bound handlers for an `event`.
    // Any `args` passed in will be sent to the handlers.
    // If a handler throws an error, we'll keep going.
    // TODO: `return false` to stop?
    trigger(eventType, ...args) {
      const event = this._createEventObject(eventType);
      this._handleEvent(event, args);
      // if we have a parent who knows how to handle events, bubble!
      if (event.bubbles && this.parent && this.parent._handleEvent && !event.isPropagationStopped()) {
        this.parent._handleEvent(event, args);
      }
      return event;
    }

    // Internal event to handle all event handlers for a given `event`
    // Respects `event.stopPropagation()` calls.
    // NOTE: you should not use this, use `trigger` instead.
    _handleEvent(event, args) {
      const handlers = this._getEventHandlers(event.type);
      if (handlers && handlers.length) {
        if (event._setCurrentTarget) event._setCurrentTarget(this);
        handlers.forEach(handler => {
          try {
            if (event.isPropagationStopped()) return;
            handler(event, ...args);
          }
          catch (e) {
            if (this._debugEvents) {
              console.error(`Error handling event ${event.type}: `, e);
              console.trace();
            }
            // stop further bubbling or default if something goes wrong
            event.stopPropagation();
            event.preventDefault();
          }
        });
      }
    }

    // Return specified event handlers for a given `event`.
    // You can pass an event type string or an event object (we'll look at `event.type`).
    // Pass a truthy `createIfNecessary`
    _getEventHandlers(event, createIfNecessary) {
      const type = (typeof event === "string" ? event : event && event.type);
      if (this.__handlers && this.__handlers[type]) return this.__handlers[type];
      if (type && createIfNecessary) {
        if (!this.hasOwnProperty("__handlers")) Object.defineProperty(this, "handlers", { value: {} });
        return (this._handlers[type] = []);
      }
    }

    // Create a `CustomEvent` object given an `eventType` and some `detail` object.
    // Sets the `target` to this object.
    //
    // You can pass any `props` if you're doing something tricky,
    // eg: `detail` or `bubbbles` or `cancelable` or a different `target`.
    _createEventObject(eventType, props) {
      const eventProps = {
        target: this,
        ...props,
      }
      return new CustomEvent(eventType, eventProps);
    }
  }

}

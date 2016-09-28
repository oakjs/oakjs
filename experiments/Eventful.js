//////////////////////////////
// Eventful higher-order class.
//////////////////////////////

import CustomEvent from "./CustomEvent";

export default function Eventful(Constructor = Object) {

  return class Eventful extends Constructor {
    // Set to true on your instance to log events
//    _debugEvents = false;

    // Register to receive a notification for an event.
    //
    // Your handler will be called as:
    //  `handler(eventObject, ...args)`
    // where `...args` are the arguments passed to `trigger()`.
    //
    // NOTE: we will NOT register the same handler twice for the same event.
    on(eventType, handler) {
      const handlers = _getEventHandlers(this, eventType, "CREATE");
      if (!handlers.includes(handler)) handlers.push(handler);
    }

    // Remove one or more handlers for an event.
    // If `handler` is undefined, we'll remove ALL notifications for that event.
    // Otherwise we'll just remove the specified handler.
    off(eventType, handler) {
      const handlers = _getEventHandlers(this, eventType)
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
        // remove event first, in case `handler` `throw`s
        this.off(eventType, handler);
        // call handler as normal
        handler(event, ...args);
      }
      this.on(eventType, wrappedHandler);
    }

    // Trigger all bound handlers for an `event`.
    // Any `args` passed in will be sent to the handlers.
    // If a handler throws an error, we'll keep going.
    // TODO: `return false` to stop?
    trigger(eventType, ...args) {
      if (this._debugEvents) console.log(`EVENT: ${eventType} for ${this}:`, args);

      const event = _createEventObject(this, eventType);
      _handleEvent(this, event, args);
      // if we have a parent who knows how to handle events, bubble!
      if (event.bubbles && !event.isPropagationStopped() && this.parent && this.parent.trigger) {
        _handleEvent(this.parent, event, args);
      }
      return event;
    }
  }

}



// Internal method to handle all event handlers for a given `event`
// Respects `event.stopPropagation()` calls.
function _handleEvent(eventful, event, args) {
  const handlers = _getEventHandlers(eventful, event.type);
//console.info(eventful, "_handleEvent", event, " args", args, "handlers", handlers);
  if (handlers && handlers.length) {
    if (event._setCurrentTarget) event._setCurrentTarget(eventful);
    handlers.forEach(handler => {
      try {
        if (event.isPropagationStopped()) return;
//console.info(eventful, "_handleEvent", event.type, " calling\n", handler+"");
        handler(event, ...args);
      }
      catch (e) {
        if (eventful._debugEvents) {
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
function _getEventHandlers(eventful, event, createIfNecessary) {
  const type = (typeof event === "string" ? event : event && event.type);
  if (eventful.__handlers && eventful.__handlers[type]) return eventful.__handlers[type];
  if (type && createIfNecessary) {
    if (!eventful.hasOwnProperty("__handlers")) Object.defineProperty(eventful, "__handlers", { value: {} });
    return (eventful.__handlers[type] = []);
  }
}

// Create a `CustomEvent` object given an `eventType` and some `detail` object.
// Sets the `target` to the eventful object.
//
// You can pass any `props` if you're doing something tricky,
// eg: `detail` or `bubbbles` or `cancelable` or a different `target`.
function _createEventObject(eventful, eventType, props) {
  const eventProps = {
    target: eventful,
    ...props,
  }
  return new CustomEvent(eventType, eventProps);
}


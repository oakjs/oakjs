//////////////////////////////
//  Higher-order Compponent class which manages calling your component's `onResize()`
//  method when the window is resized and after initial draw/redraw.
//
//  Your `onResize` will be throttled so it won't be called hyperspastically.
//  Children's `onResize` methods will be called AFTER their parent's.
//  After your widget draws/updates, your `onResize` will automatically be called "soon".
//
//  NOTE: You can only call this on normal `React.Components`,
//        it won't work on static function components.
//
//  To persist state variables for this component instance:
//      // wrap your constructor in AutoResized:
//      class MyComponent extends AutoResized(SomeOtherComponent, options) {
//        ...
//        // implement an onResize method
//        onResize(rootElement) {
//          // `this` is your component
//          // `rootElement` is your root DOM element
//        }
//        ...
//      }
//
//  If you DO NOT want to be resized automatically on initial draw / update,
//  pass `{ resizeOnDraw: false }` to `options`, eg:
//      class MyComponent extends AutoResized(SomeOtherComponent, { resizeOnDraw: false }) {
//        ...
//      }
//
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

import fn from "oak-roots/util/fn";


// ADJUST THE FOLLOWING to set the minimum delay between resizeElements calls.
const RESIZE_THROTTLE_DELAY = 100;

//
// Set things up so the resizing code is called when the window is resized.
//

// Call the `onResized` handler for each element with a `data-resized` attribute.
const TIME_RESIZE = false;
let last = Date.now();
function resizeElements() {
  if (TIME_RESIZE){
    const now = Date.now();
    const message = `resizeElements delta = ${now - last}`;
    last = now;
    console.time(message);
  }

  $("[data-resized]").each((index, element) => {
    const handler = element.onResize;
    if (typeof handler === "function") {
      handler(element);
    }
  });

  if (TIME_RESIZE) console.timeEnd(message);
}

// Throttle the `resizeElements` call so it's not called hyperspastically.
const throttledResize = fn.throttle(resizeElements, RESIZE_THROTTLE_DELAY);

// Set up window resize event to call `_resizeElements()` immediately,
//  and then no more than once every `RESIZE_THROTTLE_DELAY` msec until resizing stops,
//  calling it once at the very end as well.
$(window).on("resize", throttledResize);


// Function called automatically (or manually) below to
//  singal that this element (and all others) needs to be resized "soon".
//  Respecting the throttle delay so it doesn't call hyperspastically.
const resizeSoon = fn.debounce(throttledResize, 0);


export default function AutoResized(Component = React.Component, options = { resizeOnDraw: true }) {
  // extract options for the below
  const { resizeOnDraw } = options;

  return class AutoResized extends Component {
    // After draw, set up event and schedule us to resize `soon`.
    componentDidMount() {
      // call super method only if defined
      if (Component.prototype.componentDidMount) super.componentDidUpdate();

      const root = ReactDOM.findDOMNode(this);
      if (!root) return console.warn("AutoResized: can't find DOM node for ", this);

      root.setAttribute("data-resized", true);
      root.onResize = (element) => this.onResize(element);

      // Signal that we want our resize code to fire soon.
      if (resizeOnDraw) this.resizeSoon();
    }

    componentDidUpdate() {
      // call super method only if defined
      if (Component.prototype.componentDidUpdate) super.componentDidUpdate();

      // Signal that we want our resize code to fire soon.
      if (resizeOnDraw) this.resizeSoon();
    }

    // When unmounting, clear the `onResize` handler so we don't leak memory.
    componentWillUnmount() {
      const root = ReactDOM.findDOMNode(this);
      delete root.onResize;
    }

    // Give us the `resizeSoon` method to trigger resize explicitly.
    resizeSoon = resizeSoon;
  }
}

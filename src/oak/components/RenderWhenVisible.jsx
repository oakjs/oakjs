//////////////////////////////
//  Higher-order Compponent class which manages render your main component or a placeholder
//  according to when you're on screen.
//
//  Instead of implementing `onRender`, implement `onRenderContents` or `onRenderPlaceholder`.
//  NOTE: assumes your component is fixed size!
//
//      // wrap your constructor in RenderWhenVisible:
//      class MyComponent extends RenderWhenVisible(SomeOtherComponent, options) {
//        ...
//        // implement `onRenderContents` to render your contents when the component IS visible.
//        renderContents() {
//          // your element is visible, so draw the full view
//        }
//
//        // implement `onRenderPlaceholder` to render hwen your component IS NOT visible.
//        renderPlaceholder() {
//          // your element is not visible, so render a placeholder to take up the space.
//        }
//        ...
//      }
//
//  You can pass options to `SUI.visibility` on setup:
//      class MyComponent extends RenderWhenVisible(SomeOtherComponent, { throttle: false }) {
//        ...
//      }
//
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

const defaultOptions = {
  observeChanges: false,
  once: false,
  throttle: 100,
  events: [ "onTopVisible", "onTopVisibleReverse", "onBottomPassed", "onBottomPassedReverse" ]
}

export default function RenderWhenVisible(Component = React.Component, _options) {
  // default options and extract out list of events
  const { events, ...globalOptions } = { ...defaultOptions, _options };

  return class RenderWhenVisible extends Component {
    // Set up `state.onScreen` during construction.
    constructor(props) {
      super(props);
      this.state = {...this.state, onScreen: false };
    }

    // After draw, set up visibility stuff.
    componentDidMount() {
      this.__visbilityIsMounted = true;

      // call super method only if defined
      if (Component.prototype.componentDidMount) super.componentDidMount();

      const root = ReactDOM.findDOMNode(this);
      if (!root) return console.warn("RenderWhenVisible: can't find DOM node for ", this);

      const options = {
        ...globalOptions
      }
      const onChanged = (calculations) => this.onVisibilityChanged(calculations);
      events.forEach( eventName => options[eventName] = onChanged );
      $(root).visibility(options);
    }

    // watch update/mount events to maintain flag
    componentDidUpdate() {
      // call super method if defined
      if (Component.prototype.componentDidUpdate) super.componentDidUpdate();
      this.__visbilityIsMounted = true;
    }

    componentWillUpdate() {
      // call super method if defined
      if (Component.prototype.componentWillUpdate) super.componentWillUpdate();
      this.__visbilityIsMounted = false;
    }

    componentWillUnmount() {
      // call super method if defined
      if (Component.prototype.componentWillUnmount) super.componentWillUnmount();
      this.__visbilityIsMounted = false;
    }

    // Visibility (might have) changed -- figure out if we're showing or hiding.
    onVisibilityChanged(calculations) {
      // Forget it if we're not currently mounted.
      // Otherwise we'll get `setState` problems.
      if (!this.__visbilityIsMounted) return;

//console.log(`${this} changing to onScreen = ${calculations.onScreen}`);

      // forget it if our `onScreen` state matches the calculations
      const onScreen = calculations.onScreen;
      if (onScreen === this.state.onScreen) return;

//console.info(`${this} changing to onScreen = ${onScreen}`);
      this.setState({ onScreen });
    }

    render() {
      if (this.hidden) return;

      if (this.state.onScreen) {
        return this.renderContents() || null;
      }
      return this.renderPlaceholder() || null;
    }
  }
}

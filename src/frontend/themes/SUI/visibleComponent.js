"use strict";
//////////////////////////////
//
//  Wrapper for components which sets up a class-level registry of object instances.
//  This allows you to refer to objects `globally`, across repaints.
//
//  If you specify `props.id`, we'll use that, otherwise we'll create an id for you based on the Component class name.
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "core-decorators";

import registeredComponent from "./registeredComponent";

export default function visibleComponent(Component) {
  // Component MUST already be a `registeredComponent`
  if (!Component.REGISTRY) Component = registeredComponent(Component);
  //throw TypeError(`visibleComponent(${Component}): Component must be a registeredComponent!`);

  class VisibleComponent extends Component {
    // Add visible to our Component's propTypes and defaultProps
    static propTypes = {
      visible: PropTypes.bool,
      disabled: PropTypes.bool,
      ...Component.propTypes
    }

    static defaultProps = {
      visible: true,
      disabled: false,
      ...Component.defaultProps
    }

    //////////////////////////////
    //  Component lifecycle
    //////////////////////////////

    constructor(...args) {
      super(...args);

      // pull visible out into state and enabled, we'll manage it there
      if (!this.state) this.state = {};
      this.state.visible = this.props.visible
      this.state.disabled = this.props.disabled;
    }

    // After mounting, fire our `onShow` or `onHide` if the visibility changed.
    componentDidMount() {
      if (super.componentDidMount) super.componentDidMount();

      this.checkForStateChange(undefined, this.state);
    }

    // When we're getting new props, if our visible or disabled props have changed, update the state.
    componentWillReceiveProps(nextProps) {
      if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps);

      const deltas = this.getDeltas(nextProps, this.props, this.state);
      if (deltas) this.setState(deltas);
    }

    // After component updates, fire our `onShow` or `onHide` if the visibility changed.
    componentDidUpdate(prevProps, prevState) {
      if (super.componentDidUpdate) super.componentDidUpdate(prevProps, prevState);

      this.checkForStateChange(prevState, this.state);
    }

    // If our `state.visible` has changed, fire our `onShown` or `onHidden` events
    //  so that we can update the DOM if necessary.
    checkForStateChange(oldState, newState) {
      if (super.checkForStateChange) super.checkForStateChange(prevState, this.state);

      const deltas = this.getDeltas(newState, oldState);
      if (!deltas) return;

      const isInitialDraw = oldState === undefined;

      if ("visible" in deltas) {
        if (deltas.visible) this.onShow(isInitialDraw);
        else this.onHide(isInitialDraw);
      }

      if ("disabled" in deltas) {
        if (deltas.disabled) this.onDisable(isInitialDraw);
        else this.onEnable(isInitialDraw);
      }
    }

    static DELTA_PROPERTIES = ["visible", "disabled"];
    getDeltas(newProps, ...oldProps) {
      const deltas = {}
      let deltaFound = false;
      for (let property of this.constructor.DELTA_PROPERTIES) {
        const newValue = newProps[property];
        for (let props of oldProps) {
          if (!oldProps) continue;
          if (oldProps[property] !== newValue) {
            deltas[property] = newValue;
            deltaFound = true;
            break;
          }
        }
      }
      return (deltaFound ? deltas : undefined);
    }

    //////////////////////////////
    //  Show / hide the component.
    //////////////////////////////

    // Is the component currently visible / hidden?
    get isVisible() { return this.state.visible }
    get isHidden() { return !this.state.visible }

    // Called when component is shown, AFTER rendering completes.
    // Use this to update the DOM if necessary.
    onShow() {}

    // Called when component is hidden, AFTER rendering completes.
    // Use this to update the DOM if necessary.
    onHide() {}

    // Show the component.
    show() {
      if (this.isHidden) this.setState({ visible: true });
    }

    // Hide the component.
    hide() {
      if (this.isVisible) this.setState({ visible: false });
    }

    // Toggle visibility of the component.
    toggle(show = !this.isVisible) {
      if (show)
        return this.show();
      else
        return this.hide();
    }


    //////////////////////////////
    //  Static methods to show/hide the component.
    //////////////////////////////

    // Show/hide a component instance specified by id.
    // e.g. `MyComponent.show(id)`
    // NOTE: the component MUST have been `register()`ed first!
    static show(id, ...args) {
      const component = this.get(id, "show");
      if (component) component.show(...args);
    }
    static hide(id, ...args) {
      const component = this.get(id, "hide");
      if (component) component.hide(...args);
    }
    static toggle(id, ...args) {
      const component = this.get(id, "toggle");
      if (component) component.toggle(...args);
    }


    //////////////////////////////
    //  Enable / Disable the component
    //////////////////////////////

    get isEnabled() { return !this.state.disabled }
    get isDisabled() { return this.state.disabled }

    // Called when component is shown, AFTER rendering completes.
    onEnable() {}

    // Called when component is hidden, AFTER rendering completes.
    onDisable() {}

    // Enable the component
    enable() {
      if (this.isDisabled) this.setState({ disabled: false });
    }

    // Disable the component.
    disable() {
      if (this.isEnabled) this.setState({ disabled: true });
    }

    //////////////////////////////
    //  Static methods to enable/disable a component.
    //////////////////////////////

    // Enable/disable a component instance specified by id.
    // e.g. `MyComponent.enable(id)`
    // NOTE: the component MUST have been `register()`ed first!
    static enable(id, ...args) {
      const component = this.get(id, "enable");
      if (component) component.enable(...args);
    }
    static disable(id, ...args) {
      const component = this.get(id, "disable");
      if (component) component.disable(...args);
    }
  }

  return VisibleComponent;
}

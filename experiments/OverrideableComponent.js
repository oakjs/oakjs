"use strict";
//////////////////////////////
//
//  Wrapper for components which sets up a class-level registry of object instances.
//  This allows you to refer to objects `globally`, across repaints.
//
//
//  If you specify `props.id`, we'll use that, otherwise we'll create an key for you based on the Component class name.
//
//////////////////////////////

import React, { PropTypes } from "react";

import { diffObjects } from "./SUI";
import SUIComponent from "./SUIComponent";

class OverrideableComponent extends SUIComponent {
  //////////////////////////////
  //  Component lifecycle
  //////////////////////////////

  // Make sure we have state on construction.
  constructor() {
    super(...arguments);
    if (!this.state) this.state = {};
  }

  // If we have an `id`, register the component when mounting.
  // This allows us to access it without having a direct pointer.
  componentDidMount() {
    this.constructor.register(this);
  }

  // When properties are changing,
  //  any properties which are different than our originally passed properties
  //  should override our state values.
  componentWillReceiveProps(nextProps) {
    // Figure out which properties have actually changed
    const changedProperties = diffObjects(nextProps, this.props, true);
    // And `set` them.
    this.set(changedProperties);
  }

  componentWillUpdate() {
    // Unmount while we're re-rendering because setState is no longer state, and our `id` might change.
    this.constructor.unregister(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // re-register after updating
    this.constructor.register(this);

    // Figure out what bits of our state actually changed
    // and call our `componentDidChangeState()` routine.
    const deltas = diffObjects(this.state, prevState, true);
    if (deltas) this.componentDidChangeState(deltas, prevProps, prevState)
  }


  // If we have an `id`, UNregister the component when unmounting.
  componentWillUnMount() {
    // Unregister the component when unmounting
    this.constructor.unregister(this);
  }

  // Called AFTER we've been updated and our state (or props) have actually changed.
  // `deltas` is only the properties which have changed.
  componentDidChangeState(deltas, prevProps, prevState) {}

  //////////////////////////////
  //  Property access
  //////////////////////////////

  // If `state.property` is defined, return that, otherwise return `props.property`.
  // Otherwise return `props.property`.
  get(property) {
    if (this.state[property] !== undefined) return this.state[property];
    return this.props[property];
  }

  // Return map of all `get` for each property in `properties`.
  getAll(properties) {
    // Default to all defined `propTypes`.
    if (arguments.length === 0) properties = Object.keys(this.constructor.propTypes);

    const state = this.state;
    const props = this.props;

    const values = {};
    for (let property of properties) {
      const value = (state[property] !== undefined ? state[property] : props[property]);
      if (value !== undefined) values[property] = value;
    }
    return values;
  }

  // Set one or more state properties.
  // NOTE: does not actually set if the value is the same as `this.get(property)`.
  set(newState) {
    if (!newState) return undefined;

    // Figure out the deltas from our current values.
    const deltas = {};
    let deltaFound = false;
    for (var property in newState) {
      const newValue = newState[property];
      if (this.get(property) !== newValue) {
        deltas[property] = newValue;
        deltaFound = true;
      }
    }
    // Only set state if there was a change.
    if (deltaFound) this.setState(deltas);
  }


  //////////////////////////////
  //  Registry methods
  //////////////////////////////

  // Register a component so you can get it back later.
  // Called automatically in `componentDidMount` if your instance sets `props.id`.
  static register(component) {
    const id = component && component.get("id");
    if (!id) return;
    if (!this.REGISTRY) this.REGISTRY = {};
    // Log an error if there's already a component with that id.
    // This probably means they did a copy and paste and forgot to change the id or something like that.
    if (this.REGISTRY[id])  console.error(this, " is attempting to register a second component with id", id);
    else                    console.info(this, " is registering ", component, " as ",id);
    this.REGISTRY[id] = component;
  }

  // Unregister a component instance.
  // Called automatically in `componentWillUnmount` if you set `class.autoRegister` to true.
  static unregister(component) {
    const id = component && component.get("id");
//  console.info(this, " is unregistering ", component, " as ",id);
    if (id && this.REGISTRY) delete this.REGISTRY[id];
  }

  // Return a overrideable component by id, if there is one.
  // Pass `true` or a method name to `warnIfNotFound` to log a warning if the component can't be found.
  static get(id, warnIfNotFound) {
    if (this.REGISTRY && this.REGISTRY[id]) return this.REGISTRY[id];
    if (warnIfNotFound) {
      const method = (typeof warnIfNotFound === "string" ? warnIfNotFound : "get");
      console.warn(`${this}.${method}('${id}'): Component not found.  Did you give it a unique id?`);
    }
    return undefined;
  }

  // Returns a FUNCTION (a `thunk`) which, when called, will set some registered component's state.
  //  eg:  <Button onClick={OtherComponent.set("idOfComponentToSet", { prop: newValue })} />
  // ONLY works with components which have been given a unique id
  static set(id, newState) {
    return () => {
      const component = this.get(id);
      if (!component || !newState) return;
      component.set(newState);
    }
  }
}

export default OverrideableComponent;

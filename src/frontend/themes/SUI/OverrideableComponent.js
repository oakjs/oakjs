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
    if (this.props.id) this.constructor.register(this.props.id, this);
  }

  // If we have an `id`, register the component when mounting.
  // This allows us to access it without having a direct pointer.
  componentDidUpdate(prevProps, prevState) {
    const deltas = diffObjects(this.state, prevState, true);
    if (deltas) this.componentDidChangeState(deltas)
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

  // If we have an `id`, UNregister the component when unmounting.
  componentWillUnMount() {
    if (this.props.id) this.constructor.unregister(this.props.id);
  }

  // Called AFTER we've been updated and our state (or props) have actually changed.
  // `deltas` is only the properties which have changed.
  componentDidChangeState(deltas) {}

  //////////////////////////////
  //  Property access
  //////////////////////////////

  // If `state.property` is defined, return that, otherwise return `props.property`.
  // Otherwise return `props.property`.
  get(property) {
    if (this.state && this.state[property] !== undefined) return this.state[property];
    return this.props[property];
  }

  // Return map of all `get` for each property in `properties`.
  getAll(properties) {
    // Default to all defined `propTypes`.
    if (arguments.length === 0) properties = Object.keys(this.constructor.propTypes);

    const state = this.state || {};
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
  static register(id, component) {
    if (!this.REGISTRY) this.REGISTRY = {};
    // Log an error if there's already a component with that id.
    // This probably means they did a copy and paste and forgot to change the id or something like that.
    if (this.REGISTRY[id])  console.error(this, " is attempting to register a second component with id", id);
    else                    console.info(this, " is registering ", component, " as ",id);
    this.REGISTRY[id] = component;
  }

  // Unregister a component instance.
  // Called automatically in `componentWillUnmount` if you set `class.autoRegister` to true.
  static unregister(id) {
//  console.info(this, " is unregistering ", component, " as ",id);
    if (this.REGISTRY) delete this.REGISTRY[id];
  }

  // Return a overrideable component by id, if there is one.
  // Pass `true` or a method name to `warnIfNotFound` to log a warning if the component can't be found.
  static get(id, warnIfNotFound) {
    if (this.REGISTRY && this.REGISTRY[id]) return this.REGISTRY[id];
    if (warnIfNotFound) {
      const method = (typeof warnIfNotFound === "string" ? warnIfNotFound : "get");
      console.warn(`${this}.${method}(${id}): Component not found.  Did you give it a unique id?`);
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

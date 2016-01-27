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
import { generateId } from "./SUI";

export default function registeredComponent(Component) {

  class RegisteredComponent extends Component {
    // Copy over propTypes and make sure `id` property is defined.
    static propTypes = {
      id: PropTypes.string,
      ...Component.propTypes
    };

    //////////////////////////////
    //  Component lifecycle
    //////////////////////////////

    componentDidMount() {
      if (super.componentDidMount) super.componentDidMount();
      if (this.props.id) this.constructor.register(this.props.id, this);
    }

    componentWillUnMount() {
      if (super.componentWillUnMount) super.componentWillUnMount();
      if (this.props.id) this.constructor.unregister(this.props.id);
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

    // Return a registered component by id, if there is one.
    // Pass `true` or a method name to `warnIfNotFound` to log a warning if the component can't be found.
    static get(id, warnIfNotFound) {
      if (this.REGISTRY && this.REGISTRY[id]) return this.REGISTRY[id];
      if (warnIfNotFound) {
        const method = (typeof warnIfNotFound === "string" ? warnIfNotFound : "get");
        console.warn(`${this}.${method}(${id}): Component not found.  Did you give it a unique id?`);
      }
      return undefined;
    }
  }

  return RegisteredComponent;
}

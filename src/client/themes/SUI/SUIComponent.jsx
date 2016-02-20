"use strict";
//////////////////////////////
//
//  Base class for our SUI Components which add some nice helpers.
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

import { unknownProperties } from "./SUI";

export default class SUIComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    children: PropTypes.any,
  };

  // Return initial state given a set of props.
  // Called to set state initially on construction.
  static initialState(props) {
    return {};
  }

  //////////////////////////////
  //   Component lifecycle
  //////////////////////////////

  // Constructor function.
  constructor() {
    super(...arguments);
    this.state = this.constructor.initialState(this.props);
  }

  // Set state values to value IFF it's not already set that way (avoid uneccessary repaints).
  set(property, newValue) {
    // if property is a string, set a single property
    if (typeof property === "string") {
      // forget it if the newValue is our current value
      const currentValue = this.get(property);
      if (newValue === currentValue || (newValue === undefined && !this.state)) return;

      // if setting to `undefined`, clear the state property and call forceUpdate manually
      if (newValue === undefined) {
        delete this.state[property];
        this.forceUpdate();
      }
      else {
        this.setState({ [property]: newValue });
      }
    }
    // otherwise assume that property is a map and set each item in the map
    else {
      Object.keys(property).forEach( key => this.set(key, property[key]) );
    }
  }

  // Return ONLY the props in props which are NOT in our `propTypes`.
  getUnknownProps(props = this.props) {
    return unknownProperties(props, this.constructor.propTypes);
  }

  //////////////////////////////
  //   DOM manipulation
  //////////////////////////////

  // Return one our `ref`s DOM node as a jQuery vector.
  // If you don't pass a `ref` string, we'll get the root node.
  // NOTE: this is not very react-y...
  $ref(refName) {
    const ref = (refName ? this.refs[refName] : this);
    if (!ref) return $();
    return $(ReactDOM.findDOMNode(ref));
  }

  //////////////////////////////
  //   Async helpers
  //////////////////////////////

  // Perform some method `soon` (at the next animation frame).
  // You can pass the name of a method already defined on this instance to use that.
  // NOTE that this doesn't debounce, you should do that before you call if you want to.
  // Returns a promise which resolves() after the action completes.
  soon(method, ...args) {
    let instanceMethod = method;
    if (typeof method === "string") {
      if (typeof this[method] !== "function")
        throw new TypeError(`${this}.soon('${method}'): method not found.`);
      instanceMethod = this[method];
    }

    if (typeof method !== "function") {
      const message = message;
      console.warn(message, method);
      throw new TypeError(message);
    }

    return new Promise((resolve, reject) => {
      window.requestAnimationFrame(() => {
        try {
          const result = instanceMethod.apply(this, args);
          resolve(result);
        }
        catch (e) {
          reject(e);
        }
      });
    });
  }


  //////////////////////////////
  //   Reflection / debugging
  //////////////////////////////

  // toString at the instance level.
  toString() {
    const className = this.constructor.name;
    if (this === this.constructor.prototype) return `[${className}() prototype]`;
    const { id } = this.props;
    if (id)
      return `<${className} id=${id}/>`;

    return `<${className}/>`;
  }


  // toString at the class level.
  static toString() {
    return `SUI.${this.name}()`;
  }

}




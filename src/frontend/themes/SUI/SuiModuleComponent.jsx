"use strict";
//////////////////////////////
//
//  Base class for our SUI Components which add some nice helpers.
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

import { diffObjects, knownProperties, unknownProperties } from "./SUI";
import SUIComponent from "./SUIComponent";

export default class SUIModuleComponent extends SUIComponent {

  // REQUIRED:  Module of { key: true } for all properties which you want passed
  //            to the SUI module function when initializing or updating.
  static moduleProps = {}

  //////////////////////////////
  //   Component lifecycle
  //////////////////////////////

  componentDidMount() {
    const props = this.getModuleProps();
console.warn(props);
    this.initModule(props);
  }

  componentDidUpdate(prevProps) {
    const deltas = this.getModuleDeltas(prevProps);
    this.updateModule(deltas);
  }

  //////////////////////////////
  //   Module property manipulation
  //////////////////////////////

    // Given an object of props, return a map with non-undefined props
  //  which we pass to the `.accordion()` method.
  getModuleProps(props = this.props) {
    return knownProperties(props, this.constructor.moduleProps);
  }

  // Return an object with only the deltas between our current props and prevProps.
  // Returns `undefined` if there are no changes.
  getModuleDeltas(prevProps) {
    const current = this.getModuleProps();
    const prev = this.getModuleProps(prevProps)
    return diffObjects(current, prev);
  }

  // Initialize your  module with some props.
  // The default is just to pass the `ModuleProps` to the module function.
  // NOTE: you may want to override this to do some custom stuff.
  initModule(moduleProps = this.getModuleProps()) {
    this.tellModule(moduleProps);
  }

  // Update your  module with `deltas` passed in.
  // The default is just to pass the `deltas` to the module function.
  // NOTE: you may want to override this to do some custom stuff.
  updateModule(modulePropDeltas) {
    if (modulePropDeltas) this.tellModule(modulePropDeltas);
  }

  // Send parameters or instructions to the  module.
  // You MUST override this in your subclass.
  //  e.g.  `this.ref().myModule(...args)`
  tellModule(...args) {
    throw new TypeError(`Class ${this.constructor.name} MUST implement 'tellModule()'`);
  }


}




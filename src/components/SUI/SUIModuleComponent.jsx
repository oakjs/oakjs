"use strict";
//////////////////////////////
//
//  Base class for our SUI Components which add some nice helpers.
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

import { diffObjects, knownProperties } from "./SUI";
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
    this.setModuleProps(props);
  }

  componentDidUpdate(prevProps) {
    const deltas = this.getModuleDeltas(prevProps);
    this.setModuleProps(deltas);
  }

  //////////////////////////////
  //   Module property manipulation
  //////////////////////////////

  // Given an object of props, return a map with non-undefined props
  //  which we pass to the `.tellModule()` method to initialize / update the module.
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

  // Set proprties on your module.
  // The default is just to pass the `ModuleProps` to the module function.
  // NOTE: if you map logical prop names, this is the place to do it.
  // NOTE: you may modify `moduleProps` passed in to this function with impunity (they're a copy).
  setModuleProps(moduleProps) {
    if (moduleProps) this.tellModule(moduleProps);
    return this;
  }

  // Send parameters or instructions to the  module.
  // You MUST override this in your subclass.
  //  e.g.  `this.ref().myModule(...args)`
  tellModule(...args) {
    throw new TypeError(`Class ${this.constructor.name} MUST implement 'tellModule()'`);
  }


}




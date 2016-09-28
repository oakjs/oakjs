//////////////////////////////
// <Oidify>
//
//  Wrapper class to assign `oakid` to its one and only child.
//  This lets us map from DOM elements back to JSXElements.
//  Automatically added to the current `oak.editController`'s widgets.
//
//////////////////////////////

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";

import Rect from "oak-roots/Rect";
import elements from "oak-roots/util/elements";

export default class Oidify extends React.Component {

  static contextTypes = {
    controller: PropTypes.any,
  }

  // Return our root element.
  // No-op if we're not mounted.
  get element() {
    if (this._isMounted) return ReactDOM.findDOMNode(this);
  }

  // Return the current clientRect for our root element as a `Rect`.
  get clientRect() {
    return elements.clientRect(this.element);
  }


  assignOid() {
    const element = this.element;
    // if no dom node, the component `render()` returned `null`
    //  or we are loading the actual Component class.  Either way, don't worry about it.
    if (element === null) return;

    const { oid } = this.props;
    const controller = this.context.controller;

    if (!oid) return console.warn(`<Oidify>.assignOid(): no oid!`, controller);
    if (!controller) return console.warn(`<Oidify>.assignOid(${oid}): no controller`);

    // Return if the controller doesn't know about the oid.
    // This means that the component was drawn by something other than the `editController`,
    //  e.g. a project component being referenced on the page.
    const component = controller.getComponentForOid(oid);
    if (!component) return;// console.warn(`<Oidify>.assignOid(${oid}): no component`);

    if (!(element instanceof Element)) {
      return console.info(`<Oidify>.assignOid(${oid}): oidifying non-element\n`, element, component);
    }

    if (element.getAttribute("oakid") !== oid) {
      element.setAttribute("oakid", oid);
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.assignOid();
  }

  componentWillUpdate() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    this._isMounted = true;
    this.assignOid();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

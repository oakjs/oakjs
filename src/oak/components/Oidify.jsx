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

export default class Oidify extends React.Component {

  static contextTypes = {
    controller: PropTypes.any,
  }

  assignOid() {
    const { oid } = this.props;
    const element = ReactDOM.findDOMNode(this);
    if (!element && !(element instanceof Element)) {
      const controller = this.context.controller;
      console.info(`oidifying non-element: ${oid}\n`, element, controller.getComponentForOid(oid));
      return;
    }
    if (element.getAttribute("oakid") !== oid) {
      element.setAttribute("oakid", oid);
    }
  }

  componentDidMount() {
    this.assignOid();
  }

  componentDidUpdate() {
    this.assignOid();
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

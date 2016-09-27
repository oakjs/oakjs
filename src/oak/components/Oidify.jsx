//////////////////////////////
// <Oidify>
//
//  Wrapper class to assign `oakid` to its one and only child.
//  This lets us map from DOM elements back to JSXElements.
//  Automatically added to the current `oak.editController`'s widgets.
//
//////////////////////////////

import React from "react";
import ReactDOM from "react-dom";

export default class Oidify extends React.Component {

  assignOid() {
    const element = ReactDOM.findDOMNode(this);
    if (!element && !(element instanceof Element)) {
      console.info("oidifying non-element:", element);
      return;
    }
    const { oid } = this.props;
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

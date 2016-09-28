//////////////////////////////
// <Oidify>
//
//  Wrapper class to assign `data-oid` to its one and only child.
//  This lets us map from DOM elements back to JSXElements.
//  Automatically added to the current `oak.editController`'s widgets.
//
//////////////////////////////

import React from "react";
import ReactDOM from "react-dom";

export default class Oidify extends React.Component {

  assignOid() {
    const element = ReactDOM.findDOMNode(this);
    const child = React.Children.only(this.props.children);
//    console.info(element, child);
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

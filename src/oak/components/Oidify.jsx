//////////////////////////////
// <Oidify>
//
//  Wrapper class to yield pointers to editable JSXElements.
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

  render() {
    return React.Children.only(this.props.children);
  }
}

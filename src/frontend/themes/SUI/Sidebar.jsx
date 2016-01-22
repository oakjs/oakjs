"use strict";

//////////////////////////////
//
//  <Sidebar> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import SUIComponent from "./SUIComponent";

export default class Sidebar extends SUIComponent {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    appearance: PropTypes.string,   // `inverted vertical menu`
    visible: PropTypes.bool,        // currently visible?
    direction: PropTypes.string,    // `top`, `right`, `bottom`, `left`
    width: PropTypes.string,        // `very thin`, `thin`, `wide`, `very wide`
  };


  static defaultProps = {
    visible: false,
  };


  //////////////////////////////
  //  Lifecycle
  //////////////////////////////

  componentDidMount() {
    const $ref = this.$ref();
    const $context = $ref.parent();

    this.$ref().sidebar({
      context: $context
    });
  }

  //////////////////////////////
  //  Rendering
  //////////////////////////////

  render() {
    const { id, style, className, appearance, visible, direction, width, children } = this.props;
    const classMap = {
      visible
    }
    const props = {
      id,
      style,
      className: classNames(className, "ui", appearance, width, direction, classMap, "sidebar")
    };
    return <div {...props}>{children}</div>;
  }
}

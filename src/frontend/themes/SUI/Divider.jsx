"use strict";
//////////////////////////////
//	<Divider> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { renderIcon } from "./Icon";

export default class SUIDivider extends React.Component {
  static PropTypes = {
    key: PropTypes.any,
    className: PropTypes.string,
    appearance: PropTypes.string,  // "inverted", "fitted", "hidden", "section", "clearing"
    direction: PropTypes.string,   // "vertical" or "horizontal"
    style: PropTypes.object,
    title: PropTypes.string,       // title text
    icon: PropTypes.string         // icon INSIDE the divider
  };

  render() {
    const { key, className, appearance, direction, style, title, icon, children } = this.props;

    const props = {
      key,
      className: classNames(className, "ui", appearance, direction, "divider"),
      style
    };

    return <div {...props}>{renderIcon(icon)}{title}{children}</div>;
  }
}

"use strict";
//////////////////////////////
//	<Divider> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { renderIcon } from "./Icon";

function SUIDivider(props) {
  const { key, className, appearance, direction, style, title, icon, children } = props;

  const dividerProps = {
    key,
    className: classNames(className, "ui", appearance, direction, "divider"),
    style
  };

  return (
    <div {...dividerProps}>
      {renderIcon(icon)}
      {title}
      {children}
    </div>
  );
}

SUIDivider.PropTypes = {
  key: PropTypes.any,
  className: PropTypes.string,
  appearance: PropTypes.string,  // "inverted", "fitted", "hidden", "section", "clearing"
  direction: PropTypes.string,   // "vertical" or "horizontal"
  style: PropTypes.object,
  title: PropTypes.string,       // title text
  icon: PropTypes.string         // icon INSIDE the divider
};

// add render() method so we get hot code reload.
SUIDivider.render = Function.prototype;

export default SUIDivider;

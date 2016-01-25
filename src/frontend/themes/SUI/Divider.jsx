"use strict";
//////////////////////////////
//	<Divider> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { addElements } from "./SUI";
import Icon from "./Icon";

function SUIDivider(props) {
  const { className, style, appearance, vertical, horizontal, header, size, title, icon, clearing, children } = props;

  const tagName = (header ? "h4" : "div");
  const dividerProps = {
    className: classNames(className, "ui", { vertical, horizontal, clearing, header }, size, appearance, "divider"),
    style
  };

  let elements = addElements(title, children);
  if (icon) elements = addElements(<Icon icon={icon}/>, elements);

  return React.createElement(tagName, dividerProps, ...elements);
}

SUIDivider.defaultProps = {
  clearing: true
}

SUIDivider.PropTypes = {
  key: PropTypes.any,
  className: PropTypes.string,
  appearance: PropTypes.string,
  vertical: PropTypes.bool,
  horizontal: PropTypes.bool,
  header: PropTypes.bool,
  size: PropTypes.string,         // `tiny`, `small`, `medium`, `large`, `huge`
  style: PropTypes.object,
  title: PropTypes.string,
  icon: PropTypes.string,
  clearing: PropTypes.bool
};

// add render() method so we get hot code reload.
SUIDivider.render = Function.prototype;

export default SUIDivider;

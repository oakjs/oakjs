"use strict"
//////////////////////////////
//
//  <Header> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { renderIcon } from "./Icon";

function SUIHeader(props) {
  const { id, className, style, appearance, disabled, dividing, align, float, size, color, attached, children } = props;

  const classProps = {
    disabled,
    dividing,
    [`${align} aligned`] : align,
    [`${float} floated`] : float,
  };

  if (attached) {
    if (attached === true) classProps.attached = true;
    else classProps[`${attached} attached`] = true;
  }

  const headerProps = {
    id,
    className: classNames(className, "ui", classProps, size, color, appearance, "header"),
    style,
  }
  return <div {...headerProps}>{children}</div>;
}

SUIHeader.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,   // `block`, `inverted`,
  disabled: PropTypes.bool,
  dividing: PropTypes.bool,
  align: PropTypes.string,        // `left`, `centered`, `right`, `justified`
  float: PropTypes.string,        // `left` or `right`
  size: PropTypes.string,         // `tiny`, `small`, `medium`, `large`, `huge`
  color: PropTypes.string,        // `red`, etc
  attached: React.PropTypes.oneOfType([
    PropTypes.bool,               // `true` = center attached
    PropTypes.string,             // `top`, `bottom`,
  ]),
};

// add render() method so we get hot code reload.
SUIHeader.render = Function.prototype;

export default SUIHeader;



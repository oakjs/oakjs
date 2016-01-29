"use strict";
//////////////////////////////
//
//	<Steps> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export const QUANTITY_CLASSES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight"
];

function SUISteps(props) {
  const {
    id, className, style,
    children,
    appearance, size, ordered, vertical, quantity,
    ...otherProps
  } = props;

  const stepsProps = {
    ...otherProps,
    id,
    className: classNames(className, "ui", appearance, size, QUANTITY_CLASSES[quantity], { ordered, vertical }, "steps"),
    style
  }
  return <div {...stepsProps}>{children}</div>;
}

SUISteps.defaultProps = {}

SUISteps.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,   // "stackable", "tablet stackable"
  size: PropTypes.string,         // "small", "medium", "large"
  ordered: PropTypes.string,
  vertical: PropTypes.bool,
  quantity: PropTypes.number,
};

// add render() method so we get hot code reload.
SUISteps.render = Function.prototype;

export default SUISteps;

"use strict";
//////////////////////////////
//
//	<Steps> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import { getNameForNumber } from "./constants";

function SUISteps(props) {
  const {
    children,
    appearance, size, ordered, vertical, quantity,
    ...elementProps
  } = props;

  elementProps.className = classNames(elementProps.className, "ui", appearance, size,
                                      getNameForNumber(quantity), { ordered, vertical },
                                      "steps");
  return <div {...elementProps}>{children}</div>;
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

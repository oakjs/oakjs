"use strict"
/* eslint-disable quote-props */

//////////////////////////////
//
//   <Column> component using SemanticUI's 16-grid setup
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { getColumnWidthClass, getAlignClass } from "./constants";

function SUIColumn(props, context) {
  const {
    children,
    className, appearance, color, align, width,
    // everything else, including id and style
    ...elementProps
  } = props;

  elementProps.className = classNames(className, appearance, color, getAlignClass(align), getColumnWidthClass(width), "column");

  return <div {...elementProps}>{children}</div>;
}

SUIColumn.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,
  color: PropTypes.string,
  align: PropTypes.string,      // `left`, `center`, `right`, `justified`
  width: PropTypes.number,
  style: PropTypes.object,
};

// add render() method so we get hot code reload.
SUIColumn.render = Function.prototype;

export default SUIColumn;

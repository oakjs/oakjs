"use strict"
/* eslint-disable quote-props */

//////////////////////////////
//
//   <Row> component using SemanticUI's 16-grid setup
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import { getAlignClass, getColumnCountClass } from "./constants";

function SUIRow(props, context) {
  const {
    children,
    className, appearance, color, align, columns,
    // everything else including id, style
    ...elementProps
  } = props;

  elementProps.className = classNames(className, appearance, color, getAlignClass(align), getColumnCountClass(columns), "row");
  return <div {...elementProps}>{children}</div>;
}

SUIRow.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  color: PropTypes.string,
  align: PropTypes.string,      // `left`, `center`, `right`, `justified`
  columns: PropTypes.number,
};

// add render() method so we get hot code reload.
SUIRow.render = Function.prototype;

export default SUIRow;

"use strict"
/* eslint-disable quote-props */

//////////////////////////////
//
//   <Grid> component using SemanticUI's 16-grid setup
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Grid.css";
import { getAlignClass, getColumnCountClass } from "./constants";

export function getColumnsClass(width) {
  if (!width) return undefined;
  const widthName = getWidthName(width);
  if (widthName) return `${widthName} column`;
  return undefined;
}

function SUIGrid(props, context) {
  const {
    children,
    className, appearance, columns, align,
    // everything else including id and style
    ...elementProps
  } = props;

  elementProps.className = classNames(className, "ui", getAlignClass(align), getColumnCountClass(columns), appearance, "grid");
  return <div {...elementProps}>{children}</div>;
}

SUIGrid.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  children: PropTypes.any,

  appearance: PropTypes.string,   // "divided"
  columns: PropTypes.number,
  align: PropTypes.string
};

// add render() method so we get hot code reload.
SUIGrid.render = Function.prototype;

export default SUIGrid;

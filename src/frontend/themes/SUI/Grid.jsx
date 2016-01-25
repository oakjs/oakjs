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
import { getWidthName } from "./Column";

export function getColumnsClass(width) {
  if (!width) return undefined;
  const widthName = getWidthName(width);
  if (widthName) return `${widthName} column`;
  return undefined;
}

function SUIGrid(props, context) {
  const { id, className, style, appearance, columns, children } = props;
  const gridProps = {
    id,
    className: classNames(className, "ui", getColumnsClass(columns), appearance, "grid"),
    style
  };

  return <div {...gridProps}>{children}</div>;
}

SUIGrid.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,
  columns: PropTypes.number,
  style: PropTypes.object,
};

// add render() method so we get hot code reload.
SUIGrid.render = Function.prototype;

export default SUIGrid;

"use strict"
/* eslint-disable quote-props */

//////////////////////////////
//
//   <Column> component using SemanticUI's 16-grid setup
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export const COLUMN_NAMES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
];

export function getWidthName(width) {
  const widthName = COLUMN_NAMES[width];
  if (widthName) return widthName;

  console.warn(`Don't understand width ${width}.`);
  return undefined;
}

export function getColumnClass(width) {
  if (!width) return undefined;
  const widthName = getWidthName(width);
  if (widthName) return `${widthName} wide column`;
  return undefined;
}

function SUIColumn(props, context) {
  const { id, className, style, appearance, align, width, children } = props;

  const classMap = {
    [`${align} aligned`]: align
  }
  const columnProps = {
    id,
    className: classNames(className, appearance, getColumnClass(width), classMap, "column"),
    style
  };

  return <div {...columnProps}>{children}</div>;
}

SUIColumn.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,
  align: PropTypes.string,      // `left`, `center`, `right`, `justified`
  width: PropTypes.number,
  style: PropTypes.object,
};

// add render() method so we get hot code reload.
SUIColumn.render = Function.prototype;

export default SUIColumn;

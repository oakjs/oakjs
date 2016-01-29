"use strict"
/* eslint-disable quote-props */

//////////////////////////////
//
//   <Column> component using SemanticUI's 16-grid setup
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { getColumnsClass, getAlignClass } from "./constants";

function SUIColumn(props, context) {
  const { id, className, style, appearance, align, width, children } = props;

  const columnProps = {
    id,
    className: classNames(className, appearance, getAlignClass(align), getColumnsClass(width), "column"),
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

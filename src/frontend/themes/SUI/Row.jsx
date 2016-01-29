"use strict"
/* eslint-disable quote-props */

//////////////////////////////
//
//   <Row> component using SemanticUI's 16-grid setup
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

function SUIRow(props, context) {
  const { id, className, style, appearance, align, width, children } = props;

  const classMap = {
    [`${align} aligned`]: align
  }
  const columnProps = {
    id,
    className: classNames(className, appearance, getRowsClass(width), classMap, "column"),
    style
  };

  return <div {...columnProps}>{children}</div>;
}

SUIRow.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,
  align: PropTypes.string,      // `left`, `center`, `right`, `justified`
  width: PropTypes.number,
  style: PropTypes.object,
};

// add render() method so we get hot code reload.
SUIRow.render = Function.prototype;

export default SUIRow;

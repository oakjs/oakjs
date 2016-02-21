//////////////////////////////
//
//	<Columns> component for use with oak.
//
//  Divides the child elements equally.
//  TODO: column count & wrap?
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import { getNameForNumber } from "./constants";
import "./Columns.css";

export default function OakColumns(props) {
  const {
    id, className, style,
    children,
    appearance, count,
  } = props;


  const elementProps = {
    id,
    style,
    className: classNames(className, "oak", appearance, getNameForNumber(count), "columns"),
  }

  return <div {...elementProps}>{children}</div>;
}

OakColumns.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  count: PropTypes.number,
};

OakColumns.defaultProps = {}

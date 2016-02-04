//////////////////////////////
//
//	<Columns> component for use with oak.
//
//  Divides the child elements equally.
//  TODO: column count & wrap?
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Columns.css";

export default function OakColumns(props) {
  const {
    id, className, style,
    appearance,
    children
  } = props;


  const elementProps = {
    id,
    style,
    className: classNames(className, "oak", appearance, "Columns"),
  }

  return <div {...elementProps}>{children}</div>;
}

OakColumns.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
};

OakColumns.defaultProps = {}

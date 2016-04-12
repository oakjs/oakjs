//////////////////////////////
//
//	<Columns> component for use with oak.
//
//  Divides the child elements equally.
//  TODO: column count & wrap?
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import { getNameForNumber } from "./constants";
import "./Columns.css";

export default function Columns(props) {
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

Columns.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  count: PropTypes.number,
};

Columns.defaultProps = {}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: true, droppable: true }, Columns);

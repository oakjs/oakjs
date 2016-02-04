"use strict";
//////////////////////////////
//
//	<Fields> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";
import { getColumnWidthClass, getNameForNumber } from "./constants";

function SUIFields(props) {
  const {
    label, children,
    appearance, hidden, inline, columns, count,
    // includes id, className, style,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props: extraProps
  })
  elements.addClass(appearance, getColumnWidthClass(columns), getNameForNumber(count),
                    { inline, hidden });

  if (label) {
    elements.appendWrapped("label", undefined, label);
    elements.addClass("labeled");
  }

  elements.append(children);

  elements.addClass("fields");
  return elements.render();
}

SUIFields.defaultProps = {};

SUIFields.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  label: PropTypes.string,
  children: PropTypes.any,

  appearance: PropTypes.string,     // "collapsed", "threaded", "minimal"
  hidden: PropTypes.bool,
  columns: PropTypes.number,        // # of columns to take up
  count: PropTypes.number,          // # of fields in this row, equally sized
  inline: PropTypes.bool,

};

// add render() method so we get hot code reload.
SUIFields.render = Function.prototype;

export default SUIFields;

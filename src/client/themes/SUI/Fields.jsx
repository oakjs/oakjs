"use strict";
//////////////////////////////
//
//	<Fields> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import ElementBuffer from "./ElementBuffer";
import { getColumnWidthClass, getNameForNumber } from "./constants";

import { renderError } from "./Input"



function SUIFields(props) {
  const {
    label, children,
    disabled, readonly, error,
    appearance, hidden, inline, grouped, columns, count,
    // includes id, className, style,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props: extraProps
  })
  elements.addClass(appearance, getColumnWidthClass(columns), getNameForNumber(count),
                    { inline, grouped: grouped && !inline, hidden, disabled, error, "read-only": readonly });

  if (label) {
    elements.appendWrapped("label", undefined, label);
    elements.addClass("labeled");
    if (error) renderError(elements, error);
  }

  elements.append(children);

  if (!label && error) renderError(elements, error);

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
  grouped: PropTypes.bool,

  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  error: React.PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
};

// add render() method so we get hot code reload.
SUIFields.render = Function.prototype;

export default SUIFields;

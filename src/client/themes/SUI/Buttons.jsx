//////////////////////////////
//
//	<Buttons> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import { getNameForNumber, getFloatedClass, getAttachedClass } from "./constants";

function SUIButtons(props) {
  const {
    appearance, size, color, count, floated, style,
    children,
    ...elementProps
  } = props;

  elementProps.className = classNames(
    elementProps.className,
    "ui", appearance, size, color,
    getNameForNumber(count), getFloatedClass(floated),
    "buttons"
  );

  return <div {...elementProps}>{children}</div>;
}

SUIButtons.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.any,

  appearance: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  count: PropTypes.number,
  floated: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIButtons.render = Function.prototype;

export default SUIButtons;

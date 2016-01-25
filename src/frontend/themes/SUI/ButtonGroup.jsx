//////////////////////////////
//
//	<ButtonGroup> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export const COUNT_NAMES = [
 undefined, "one", "two", "three",
 "four", "five", "six", "seven",
 "eight", "nine", "ten", "eleven", "twelve"
];


function SUIButtonGroup(props) {
  const { id, className, appearance, size, compact, color, count, floated, attached, style, children } = props;

  const classMap = {
    [`${COUNT_NAMES[count]}`]: count,
    [`${floated} floated`]: floated,
    [`${attached} attached`]: attached,
    compact
  }
  const outerProps = {
    id,
    className: classNames(className, "ui", appearance, size, color, classMap, "buttons"),
    style
  }
  return <div {...outerProps}>{children}</div>;
}

SUIButtonGroup.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,
  size: PropTypes.string,
  compact: PropTypes.bool,
  color: PropTypes.string,
  count: PropTypes.number,
  floated: PropTypes.string,
  attached: PropTypes.string,
  style: PropTypes.object
};

// add render() method so we get hot code reload.
SUIButtonGroup.render = Function.prototype;

export default SUIButtonGroup;

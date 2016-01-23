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


export default class SUIButtonGroup extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    appearance: PropTypes.string,
    size: PropTypes.string,
    compact: PropTypes.bool,
    color: PropTypes.string,
    count: PropTypes.number,
    float: PropTypes.string,
    attached: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const { id, className, appearance, size, compact, color, count, float, attached, style, children } = this.props;

    const classMap = {
      [`${COUNT_NAMES[count]}`]: count,
      [`${float} floated`]: float,
      [`${attached} attached`]: attached,
      compact
    }
    const props = {
      id,
      className: classNames(className, "ui", appearance, size, color, classMap, "buttons"),
      style
    }
    return <div {...props}>{children}</div>;
  }
}
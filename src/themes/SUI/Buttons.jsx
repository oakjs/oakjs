//////////////////////////////
//
//	<Buttons> component for use with SemanticUI
//
// TODO: add `visible` to examples stack
// TODO: `enabled`
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import SUIComponent from "./SUIComponent";
import { getNameForNumber, getFloatedClass, getAttachedClass } from "./constants";

export default class SUIButtons extends SUIComponent {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.any,

    visible: PropTypes.bool,
    appearance: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    count: PropTypes.number,
    floated: PropTypes.string,
  };

  static defaultProps = {
    visible: true
  }

  render() {
    const {
      visible, appearance, size, color, count, floated, style,
      children,
      ...elementProps
    } = this.props;

    if (!visible) return null;

    elementProps.className = classNames(
      elementProps.className,
      "ui", appearance, size, color,
      getNameForNumber(count), getFloatedClass(floated),
      "buttons"
    );

    return <div {...elementProps}>{children}</div>;
  }
}

export default SUIButtons;

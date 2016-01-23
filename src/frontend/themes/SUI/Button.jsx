"use strict"
//////////////////////////////
//
//  <Button> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import Icon from "./Icon";

// `appearance`:  any combination of:
//    - `primary`, `secondary`
//    - `animated, `vertical animated`, `animated fade`, etc.
export default class SUIButton extends React.Component {
  static defaultProps = {
    labelAppearance: "basic"
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    appearance: PropTypes.string,
    size: PropTypes.string,     // TODO: appearance?
    compact: PropTypes.bool,    // TODO: appearance?
    circular: PropTypes.bool,   // TODO: appearance?
    color: PropTypes.string,    // TODO: appearance?
    float: PropTypes.string,    // TODO: appearance?
    attached: PropTypes.string,
    style: PropTypes.object,

    title: PropTypes.string,
    icon: PropTypes.string,
    label: React.PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.element
          ]),
    labelDirection: PropTypes.string,
    labelAppearance: PropTypes.string,

    active: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    toggle: PropTypes.bool,
    onClick: PropTypes.func
  };

  renderLabel(buttonElement) {
    const { labelDirection } = this.props;

    const labelElement = this.renderLabelElement();
    const labelContainerProps = {
      className: classNames("ui", labelDirection, "labeled button"),
      tabIndex: "0"
    }

    const elements = labelDirection && labelDirection.includes("left")
                   ? [labelElement, buttonElement]
                   : [buttonElement, labelElement];
    return React.createElement("div", labelContainerProps, ...elements);
  }

  renderLabelElement() {
    const { label, labelAppearance, color } = this.props;

    // if we didn't get a string, we assume we got a rendered label
    if (typeof label !== "string") return label;

    const labelProps = {
      className: classNames("ui", labelAppearance, color, "label")
    }
    return <a {...labelProps}>{label}</a>
  }


  render () {
    const { id,
      // appearance
      className, appearance, size, compact, circular, color, float, attached, style,
      // content / label
      title, icon, label, children=[],
      // events & states
      active, disabled, loading, toggle, onClick,
    } = this.props;

    const classMap = {
      compact,
      circular,
      icon: icon && !(title || children),
      [`${float} floated`]: float,
      [`${attached} attached`]: attached,
      active,
      disabled,
      loading,
      toggle
    }

    const props = {
      id,
      className: classNames(className, "ui", appearance, size, color, classMap, "button"),
      style,
      onClick
    };

    const iconElement = (icon && <Icon icon={icon}/> : undefined);
    const buttonElement = React.createElement(attached ? "div" : "button", props, iconElement, title, ...children);

    if (label) return this.renderLabel(buttonElement);
    return buttonElement;
  }
}



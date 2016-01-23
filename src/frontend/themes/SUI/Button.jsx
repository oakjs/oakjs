"use strict"
//////////////////////////////
//
//  <Button> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { renderIcon } from "./Icon";

// `appearance`:  any combination of:
//    - `primary`, `secondary`
//    - `animated, `vertical animated`, `animated fade`, etc.
function SUIButton(props) {
  const { id,
    // appearance
    className, appearance, size, compact, circular, color, float, attached, style,
    // content / label
    title, icon, label, children,
    // events & states
    active, disabled, loading, toggle, onClick,
  } = props;

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

  const buttonType = (attached ? "div" : "button");
  const buttonProps = {
    id,
    className: classNames(className, "ui", appearance, size, color, classMap, "button"),
    style,
    onClick
  };
  const buttonElements = [renderIcon(icon), title].concat(children);
  const buttonElement = React.createElement(buttonType, buttonProps, ...buttonElements);

  if (label) renderLabel(buttonElement, props);
  return buttonElement;
}

function renderLabel(buttonElement, props, context) {
  const { label, labelAppearance, labelDirection, color } = props;

  // if we didn't get a string, we assume we got a rendered label
  let labelElement;
  if (typeof label !== "string") {
    labelElement = label;
  }
  else {
    const labelProps = {
      className: classNames("ui", labelAppearance, color, "label")
    }
    labelElement = <a {...labelProps}>{label}</a>;
  }

  const labelContainerProps = {
    className: classNames("ui", labelDirection, "labeled button"),
    tabIndex: "0"
  }

  // Which goes first, the chicken or the egg?
  const elements = labelDirection && labelDirection.includes("left")
                 ? [labelElement, buttonElement]
                 : [buttonElement, labelElement];
  return React.createElement("div", labelContainerProps, ...elements);
}

SUIButton.defaultProps = {
  labelAppearance: "basic"
};

SUIButton.propTypes = {
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

// add render() method so we get hot code reload.
SUIButton.render = Function.prototype;

export default SUIButton;

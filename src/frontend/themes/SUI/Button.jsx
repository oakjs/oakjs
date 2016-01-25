"use strict"
//////////////////////////////
//
//  <Button> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { addElements, addElementsOn } from "./SUI";
import Icon from "./Icon";

// `appearance`:  any combination of:
//    - `primary`, `secondary`
//    - `animated, `vertical animated`, `animated fade`, etc.
function SUIButton(props) {
  const { id, className, style,
    // appearance
    appearance, size, compact, circular, color, floated, attached,
    // content / label
    title, icon, label, children,
    // events & states
    active, disabled, loading, toggle, onClick,
  } = props;

  const classMap = {
    compact,
    circular,
    active,
    disabled,
    loading,
    toggle,
    icon: icon && !(title || children),
    [`${floated} floated`]: floated,
    [`${attached} attached`]: attached,
  }

  const buttonType = (attached ? "div" : "button");
  const buttonProps = {
    id,
    className: classNames(className, "ui", appearance, size, color, classMap, "button"),
    style,
    onClick
  };

  let buttonChildren = addElements(title, children);
  if (icon) buttonChildren = addElements(<Icon icon={icon}/>, buttonChildren);

  const buttonElement = React.createElement(buttonType, buttonProps, ...buttonChildren);
  if (label) return renderLabel(props, buttonElement);
  return buttonElement;
}

function renderLabel(props, buttonElement) {
  const { label, labelAppearance, labelOn, color } = props;

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
    className: classNames("ui", labelOn, "labeled button"),
    tabIndex: "0"
  }

  // Which goes first, the chicken or the egg?
  let elements = addElementsOn(labelOn, labelElement, buttonElement);
  return React.createElement("div", labelContainerProps, ...elements);
}

SUIButton.defaultProps = {
  labelOn: "right",
  labelAppearance: "basic"
};

SUIButton.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  size: PropTypes.string,
  compact: PropTypes.bool,
  circular: PropTypes.bool,
  color: PropTypes.string,
  floated: PropTypes.string,
  attached: PropTypes.string,

  title: PropTypes.string,
  icon: PropTypes.string,
  label: React.PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
  labelOn: PropTypes.string,
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

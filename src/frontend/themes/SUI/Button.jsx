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
export default function Button(props) {
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

  const buttonProps = {
    id,
    className: classNames(className, "ui", appearance, size, color, classMap, "button"),
    style,
    onClick
  };

  const iconElement = (icon && <Icon icon={icon}/> : undefined);
  const buttonElement = (attached ? <div {...buttonProps}>{iconElement}{title}{children}</div>
                                  : <button {...buttonProps}>{iconElement}{title}{children}</button>);

  if (label) return renderLabel(buttonElement, props)
  return buttonElement;
}

Button.defaultProps = {
  labelAppearance: "basic"
}

Button.propTypes = {
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

function renderLabel(buttonElement, props) {
  const { labelDirection } = props;

  const labelElement = renderLabelElement(props);
  const labelContainerProps = {
    className: classNames("ui", labelDirection, "labeled button"),
    tabIndex: "0"
  }

  if (labelDirection && labelDirection.includes("left")) {
    return <div {...labelContainerProps}>{labelElement}{buttonElement}</div>;
  }
  else {
    return <div {...labelContainerProps}>{buttonElement}{labelElement}</div>;
  }


}

function renderLabelElement(props) {
  const { label, labelAppearance, color } = props;

  // if we didn't get a string, we assume we got a rendered label
  if (typeof label !== "string") return label;

  const labelProps = {
    className: classNames("ui", labelAppearance, color, "label")
  }
  return <a {...labelProps}>{label}</a>
}

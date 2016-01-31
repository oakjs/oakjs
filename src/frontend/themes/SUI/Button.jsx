"use strict"
//////////////////////////////
//
//  <Button> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { getFloatedClass } from "./constants";
import ElementBuffer from "./ElementBuffer";

// `appearance`:  any combination of:
//    - `primary`, `secondary`
//    - `animated, `vertical animated`, `animated fade`, etc.
function SUIButton(props) {
  const {
    // appearance
    appearance="", size, circular, color, floated,
    // content / label
    title, icon, children,
    // events & states
    active, disabled, loading, toggle,
    // label stuff
    label, labelAppearance, labelOn,

    // everything else, including id, className, style, onClick
    ...elementProps
  } = props;

  const buttonElements = new ElementBuffer({
    type: (appearance.includes("attached") ? "div" : "button"),
    props: elementProps,
  });
  buttonElements.addClass("ui", appearance, size, color, getFloatedClass(floated));
  buttonElements.addClass({ circular, active, disabled, loading, toggle, icon: icon && !(title || children) });
  buttonElements.addClass("button");

  if (icon) buttonElements.appendIcon(icon);
  buttonElements.append(title, children);

  // If we didn't get a label, just return the button
  if (!label) return buttonElements.render();

  // Otherwise we need to create the wrapper and add label + button to it
  const labelWrapper = new ElementBuffer({
    props: {
      className: classNames("ui", labelOn, "labeled button"),
      tabIndex: "0"
    },
    elements: buttonElements.render()
  });

  // if we didn't get a string, we assume we got a rendered label
  const labelElement = typeof label !== "string"
                     ? label
                     : <a className={classNames("ui", labelAppearance, color, "label")}>{label}</a>;
  labelWrapper.addOn(labelOn, labelElement);
  return labelWrapper.render();
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
  circular: PropTypes.bool,
  color: PropTypes.string,
  floated: PropTypes.string,

  title: PropTypes.string,
  icon: PropTypes.string,
  childen: PropTypes.any,

  label: React.PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
  labelAppearance: PropTypes.string,
  labelOn: PropTypes.string,

  active: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  toggle: PropTypes.bool,
  onClick: PropTypes.func
};

// add render() method so we get hot code reload.
SUIButton.render = Function.prototype;

export default SUIButton;

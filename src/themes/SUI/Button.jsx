"use strict"
//////////////////////////////
//
//  <Button> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import { getFloatedClass, getAttachedClass } from "./constants";
import ElementBuffer from "./ElementBuffer";

import "./Button.css";


const APPEARANCES = [
  "circular", "basic", "inverted", "fluid",
  "labeled icon", "right labeled icon",
  "facebook", "twitter", "google plus", "vk", "linkedin", "instagram", "youtube",
  "animated", "vertical animated", "animated fade"
  ];

// `appearance`:  any combination of:
//    - `primary`, `secondary`
//    - `animated, `vertical animated`, `animated fade`, etc.
export default class SUIButton extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.any,

    label: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.element
          ]),
    labelAppearance: PropTypes.string,
    labelOn: PropTypes.string,
    id: PropTypes.string,

    onClick: PropTypes.func,

    appearance: PropTypes.oneOfType([
      PropTypes.oneOf(APPEARANCES),
      PropTypes.arrayOf(PropTypes.oneOf(APPEARANCES))
    ]),
    size: PropTypes.oneOf(["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"]),
    color: PropTypes.oneOf(["primary", "secondary", "positive", "negative", "red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"]),
    floated: PropTypes.oneOf(["left", "right"]),
    attached: PropTypes.oneOf(["top", "bottom", "left", "right"]),
    className: PropTypes.string,
    style: PropTypes.object,

    active: PropTypes.bool,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    loading: PropTypes.bool,
    toggle: PropTypes.bool,
  };

  static defaultProps = {
    labelOn: "right",
    labelAppearance: "basic"
  };

  render() {
    const {
      // appearance
      appearance="", size, color, floated, attached,
      // content / label
      title, icon, children,
      // events & states
      active, disabled, hidden, loading, toggle,
      // label stuff
      label, labelAppearance, labelOn,

      // everything else, including id, className, style, onClick
      ...elementProps
    } = this.props;

    if (hidden) return null;

    const buttonElements = new ElementBuffer({
      type: (attached ? "div" : "button"),
      props: elementProps,
    });
    buttonElements.addClass("ui", appearance, size, color, getFloatedClass(floated), getAttachedClass(attached));
    buttonElements.addClass({ active, disabled, loading, toggle, icon: icon && !(title || children) });
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
      elements: [ buttonElements.render() ]
    });

    // if we didn't get a string, we assume we got a rendered label
    const labelElement = typeof label !== "string"
                       ? label
                       : <a className={classNames("ui", labelAppearance, color, "label")}>{label}</a>;
    labelWrapper.addOn(labelOn, labelElement);
    return labelWrapper.render();
  }
}

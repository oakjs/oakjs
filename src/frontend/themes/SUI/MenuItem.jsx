"use strict"
//////////////////////////////
//
//  <MenuItem> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";

import MenuHeader from "./MenuHeader";
import Divider from "./Divider";

// `appearance`:  any combination of:
//    - `fitted`, `horizontally fitted`, `vertically fitted`
//    - `inverted`, `red`, `blue`, etc
//    -
function SUIMenuItem(props) {
 const {
    id, className, style,
    value, label = value, children,
    appearance, align, icon,
    active, disabled,
    href, onClick,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    type: (href ? "a" : "div"),
    props: {
      ...extraProps,
      id,
      style,
      className: [className, appearance, align, { active, disabled }, "item"],
      "data-value": value,
      "data-text": label,
      href,
      onClick,
    }
  });

  if (icon) elements.appendIcon(icon);
  if (label) elements.append(label);
  if (children) elements.append(children);

  return elements.render();
}

SUIMenuItem.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  value: PropTypes.any,
  label: PropTypes.string,

  appearance: PropTypes.string,
  align: PropTypes.string,
  icon: PropTypes.string,

  active: PropTypes.bool,
  disabled: PropTypes.bool,

  href: PropTypes.string,       // action to take when menu item is clicked
  onClick: PropTypes.func       // onClick action

};

// add render() method so we get hot code reload.
SUIMenuItem.render = Function.prototype;

export default SUIMenuItem;

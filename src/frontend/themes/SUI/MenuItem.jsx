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
    label, value = label, children,
    appearance, align, icon,
    active, disabled,
    ...extraProps
  } = props;

  // If label starts with "-", return a Header instead
  if (value === undefined && label && label[0] === "#") {
    const headerProps = {
      id,
      className,
      style,
      label: label.substr(1),
      icon,
      children
    }
    return <MenuHeader {...headerProps}/>;
  }

  // if it's all dashes, make a separator instead
  if (value === undefined && label && /^-+$/.test(label)) {
    return <Divider/>;
  }

  const elements = new ElementBuffer({
    props: {
      ...extraProps,
      id,
      style,
      className: [className, appearance, align, { active, disabled }, "item"],
      "data-value": value,
      "data-text": label,
    }
  });

  if (icon) elments.appendIcon(icon);
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
};

// add render() method so we get hot code reload.
SUIMenuItem.render = Function.prototype;

export default SUIMenuItem;

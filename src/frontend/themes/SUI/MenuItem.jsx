"use strict"
//////////////////////////////
//
//  <MenuItem> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import Icon from "./Icon";
import MenuHeader from "./MenuHeader";
import Divider from "./Divider";

// `appearance`:  any combination of:
//    - `fitted`, `horizontally fitted`, `vertically fitted`
//    - `inverted`, `red`, `blue`, etc
//    -
function SUIMenuItem(props) {
 const { key, label, value = label, active, disabled, className, appearance, align, icon, children } = props;

  // If label starts with "-", return a Header instead
  if (value === undefined && label && label[0] === "#")
    return <MenuHeader {...{ key, label:label.substr(1), icon, className, children }}/>;

  // if it's all dashes, make a separator instead
  if (value === undefined && label && /^-+$/.test(label))
    return <Divider {...{ key }}/>;

  const itemProps = {
    key,
    active,
    "data-value": value,
    "data-text": label,
    className: classNames(className, appearance, align, { disabled }, "item")
  };

  return (
    <div {...itemProps}>
      {icon ? <Icon icon={icon}/> : undefined}
      {label}
      {children}
    </div>
  );
}

SUIMenuItem.propTypes = {
  key: PropTypes.any,
  value: PropTypes.any,
  label: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  appearance: PropTypes.string,
  className: PropTypes.string,
  align: PropTypes.string,
  icon: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIMenuItem.render = Function.prototype;

export default SUIMenuItem;

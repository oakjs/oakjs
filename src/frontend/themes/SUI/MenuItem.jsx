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
export default function MenuItem(props) {
 const { key, label, value = label, active, disabled, appearance, className, icon, children } = props;

  // If label starts with "-", return a Header instead
  if (value === undefined && label[0] === "#")
    return <MenuHeader {...{ key, label:label.substr(1), icon, className, children }}/>;

  // if it's all dashes, make a separator instead
  if (value === undefined && /^-+$/.test(label))
    return <Divider {...{ key }}/>;

  const itemProps = {
    key,
    active,
    "data-value": value,
    "data-text": label,
    className: classNames(appearance, { disabled, className }, "item")
  };

  return (
    <div {...itemProps}>
      {icon ? <Icon icon={icon}/> : undefined}
      {label}
      {children}
    </div>
  );
}

MenuItem.propTypes = {
  key: PropTypes.any,
  value: PropTypes.any,
  label: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  appearance: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string,
//  children: PropTypes.arrayOf(PropTypes.element),
};

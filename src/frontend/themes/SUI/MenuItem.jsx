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
export default class SUIMenuItem extends React.Component {
  static propTypes = {
    key: PropTypes.any,
    value: PropTypes.any,
    label: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    appearance: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string,
  };

  render() {
   const { key, label, value = label, active, disabled, appearance, className, icon, children } = this.props;

    // If label starts with "-", return a Header instead
    if (value === undefined && label && label[0] === "#")
      return <MenuHeader {...{ key, label:label.substr(1), icon, className, children }}/>;

    // if it's all dashes, make a separator instead
    if (value === undefined && label && /^-+$/.test(label))
      return <Divider {...{ key }}/>;

    const props = {
      key,
      active,
      "data-value": value,
      "data-text": label,
      className: classNames(className, appearance, { disabled }, "item")
    };

    return (
      <div {...props}>
        {icon ? <Icon icon={icon}/> : undefined}
        {label}
        {children}
      </div>
    );
  }
}

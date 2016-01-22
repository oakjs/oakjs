//////////////////////////////
//  <MenuHeader> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { renderIcon } from "./Icon";

export default function SUIMenuHeader(props) {
  const { key, className, icon, label, children } = props;

  const menuProps = {
    key,
    className : classNames(className, "header", "item")
  };
  return (
    <div {...menuProps}>
      {renderIcon(icon)}
      {label}
      {children}
    </div>
  );
}
SUIMenuHeader.propTypes = {
  key: PropTypes.any,
  className: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
};

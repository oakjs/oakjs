//////////////////////////////
//  <MenuHeader> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import Icon from "./Icon";

export default function MenuHeader({ key, className, icon, label, children } = {}) {
  const props = {
    key,
    className : classNames("header", { className })
  };
  return (
    <div {...props}>
      {icon ? <Icon {...{ icon }}/> : undefined}
      {label}
      {children}
    </div>
  );
}
MenuHeader.propTypes = {
  key: PropTypes.any,
  className: PropTypes.string,
  icon: PropTypes.icon,
  label: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
};

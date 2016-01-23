//////////////////////////////
//  <MenuHeader> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { renderIcon } from "./Icon";

function SUIMenuHeader(props) {
  const { key, className, icon, label, children } = props;
  const headerProps = {
    key,
    className : classNames(className, "header", "item")
  };
  return (
    <div {...headerProps}>
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

// add render() method so we get hot code reload.
SUIMenuHeader.render = Function.prototype;

export default SUIMenuHeader;

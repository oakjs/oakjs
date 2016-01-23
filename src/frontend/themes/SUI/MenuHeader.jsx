//////////////////////////////
//  <MenuHeader> component
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { renderIcon } from "./Icon";

export default class SUIMenuHeader extends React.Component {
  static propTypes = {
    key: PropTypes.any,
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
  };

  render() {
    const { key, className, icon, label, children } = this.props;
    const props = {
      key,
      className : classNames(className, "header", "item")
    };
    return (
      <div {...props}>
        {renderIcon(icon)}
        {label}
        {children}
      </div>
    );
  }
}

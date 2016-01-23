"use strict"
//////////////////////////////
//
//  <SubHeader> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default class SUISubHeader extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    appearance: PropTypes.string,
  };

  render() {
    const { id, className, style, appearance, children } = this.props;
    const props = {
      id,
      className: classNames(className, appearance, "sub header"),
      style,
    }
    return <div {...props}>{children}</div>;
  }
}

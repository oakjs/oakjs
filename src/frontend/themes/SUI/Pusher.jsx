"use strict"
//////////////////////////////
//
//  <Pusher> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default class SUIPusher extends React.Component {
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
      className: classNames(className, appearance, "pusher"),
      style,
    }
    return <div {...props}>{children}</div>;
  }
}

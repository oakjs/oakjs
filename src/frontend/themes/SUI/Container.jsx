"use strict"
//////////////////////////////
//
//  <Container> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default class SUIContainer extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    appearance: PropTypes.string, // `fluid`, `text`, grid stuff, see: http://semantic-ui.com/elements/container.html#/examples
    align: PropTypes.string,      // `left`, `center`, `right`, `justified`
    style: PropTypes.object,
  };

  render() {
    const { id, className, appearance, align, style, children } = this.props;

    const classMap = {
      [`${align} aligned`]: align
    }
    const props = {
      id,
      className: classNames(className, "ui", appearance, classMap, "container"),
      style
    };

    return <div {...props}>{children}</div>;
  }
}

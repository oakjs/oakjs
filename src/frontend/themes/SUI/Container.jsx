"use strict"
//////////////////////////////
//
//  <Container> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

// `appearance`:  any combination of:
//    - `fluid`, `text`
//    - grid stuff, see: http://semantic-ui.com/elements/container.html#/examples
export default function Container(props) {
  const { id, className, appearance, align, style, children } = props;

  const classMap = {
    [`${align} aligned`]: align
  }
  const outputProps = {
    id,
    className: classNames(className, "ui", appearance, classMap, "container"),
    style
  };

  return <div {...outputProps}>{children}</div>;
}

Container.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string, // `fluid`, `text`, grid stuff, see: http://semantic-ui.com/elements/container.html#/examples
  align: PropTypes.string,      // `left`, `center`, `right`, `justified`
  style: PropTypes.object,
};

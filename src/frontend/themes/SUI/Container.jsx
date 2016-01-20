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
//    - `left aligned`, `center aligned`, `right aligned`, `justified`
//    - grid stuff, see: http://semantic-ui.com/elements/container.html#/examples
export default function Container(props) {
  const { id, className, appearance, style, children } = props;

  const outputProps = {
    id,
    className: classNames(className, "ui", appearance, "container"),
    style
  };

  return <div {...outputProps}>{children}</div>;
}

Container.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,
  style: PropTypes.object,
};

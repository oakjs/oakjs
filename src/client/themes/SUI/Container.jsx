"use strict"
//////////////////////////////
//
//  <Container> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames, unknownProps } from "oak-roots/util/react";

function SUIContainer(props) {
  const { id, className, appearance, align, style, children } = props;

  const classMap = {
    [`${align} aligned`]: align
  }
  const containerProps = {
    id,
    className: classNames(className, "ui", appearance, classMap, "container"),
    style,
    ...unknownProps(props, SUIContainer.propTypes)
  };

  return <div {...containerProps}>{children}</div>;
}

SUIContainer.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string, // `fluid`, `text`, grid stuff, see: http://semantic-ui.com/elements/container.html#/examples
  align: PropTypes.string,      // `left`, `center`, `right`, `justified`
  style: PropTypes.object,
};

// add render() method so we get hot code reload.
SUIContainer.render = Function.prototype;

export default SUIContainer;

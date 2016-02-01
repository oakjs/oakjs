"use strict"
//////////////////////////////
//
//  <Content> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

function SUIContent(props) {
  const {
    children,
    appearance,
    // includes id, className, style
    ...contentProps
  } = props;

  contentProps.className = classNames(contentProps.className, appearance, "content");

  return React.createElement("div", contentProps, children);
}

SUIContent.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,

  appearance: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIContent.render = Function.prototype;

export default SUIContent;

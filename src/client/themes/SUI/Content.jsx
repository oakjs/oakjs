"use strict"
//////////////////////////////
//
//  <Content> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import { getAlignClass } from "./constants";

function SUIContent(props) {
  const {
    children,
    appearance, align,
    // includes id, className, style
    ...contentProps
  } = props;

  contentProps.className = classNames(contentProps.className, appearance, getAlignClass(align), "content");

  return React.createElement("div", contentProps, children);
}

SUIContent.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,

  appearance: PropTypes.string,
  align: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIContent.render = Function.prototype;

export default SUIContent;

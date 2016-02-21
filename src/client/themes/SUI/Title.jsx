"use strict"
//////////////////////////////
//
//  <Title> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import { getAlignClass, getFloatedClass } from "./constants";

function SUITitle(props) {
  const {
    children,
    appearance, align,
    // includes id, className, style
    ...contentProps
  } = props;

  contentProps.className = classNames(contentProps.className, getAlignClass(align), appearance, "title");

  return React.createElement("div", contentProps, children);
}

SUITitle.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,

  appearance: PropTypes.string,
  align: PropTypes.string,
};

// add render() method so we get hot code reload.
SUITitle.render = Function.prototype;

export default SUITitle;

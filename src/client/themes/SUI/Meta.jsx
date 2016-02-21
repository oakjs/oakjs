"use strict"
//////////////////////////////
//
//  <Meta> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import { getAlignClass, getFloatedClass } from "./constants";

function SUIMeta(props) {
  const {
    children,
    appearance, align, floated,
    // includes id, className, style
    ...contentProps
  } = props;

  contentProps.className = classNames(contentProps.className, getAlignClass(align), getFloatedClass(floated), appearance, "meta");

  return React.createElement("div", contentProps, children);
}

SUIMeta.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,

  appearance: PropTypes.string,
  align: PropTypes.string,
  floated: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIMeta.render = Function.prototype;

export default SUIMeta;

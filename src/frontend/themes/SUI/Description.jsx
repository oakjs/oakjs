"use strict"
//////////////////////////////
//
//  <Description> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { getFloatedClass } from "./constants";

function SUIDescription(props) {
  const {
    children,
    appearance,
    // includes id, className, style
    ...contentProps
  } = props;

  contentProps.className = classNames(contentProps.className, appearance, "description");

  return React.createElement("div", contentProps, children);
}

SUIDescription.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,

  appearance: PropTypes.string,
  floated: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIDescription.render = Function.prototype;

export default SUIDescription;

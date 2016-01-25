//////////////////////////////
//
//	<ImageGroup> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import SUIImage, { getImageClassName } from "./Image";

function SUIImageGroup(props, context) {
  const { id, style, float, children } = props;
  const groupProps = {
    id,
    className: getImageClassName(props).replace(/\bimage$/, "images"),
    style
  }
  const tagName = (float ? "span" : "div");
  return React.createElement(tagName, groupProps, ...children);
}

SUIImage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  size: PropTypes.string,   // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  float: PropTypes.string,
  valign: PropTypes.string,
  spaced: React.PropTypes.oneOfType([
    PropTypes.bool,                     // `true` = space
    PropTypes.string,                   // `left`, `right`,
  ]),
};

// add render() method so we get hot code reload.
SUIImageGroup.render = Function.prototype;

export default SUIImageGroup;

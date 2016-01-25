//////////////////////////////
//
//	<Images> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { addElements } from "./SUI";
import { FLOAT_CLASS_MAP, VALIGN_CLASS_MAP, SPACED_CLASS_MAP } from "./Image";

function SUIImages(props, context) {
  const {
    // content
    children,
    // appearance
    className, appearance, size, floated, valign, spaced,
    // state & events
    hidden, disabled,
    // everything else including id and style
    ...ImagesProps
  } = props;

  // class name
  const classProps = {
    hidden,
    disabled,
  }
  if (floated) classProps[FLOAT_CLASS_MAP[floated]] = true;
  if (spaced) classProps[SPACED_CLASS_MAP[spaced]] = true;
  if (valign) classProps[VALIGN_CLASS_MAP[valign]] = true;
  ImagesProps.className = classNames("ui", appearance, size, classProps, "images");

  return <span {...ImagesProps}>{children}</span>;
}

SUIImages.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  size: PropTypes.string,   // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
  floated: PropTypes.string,
  valign: PropTypes.string,
  spaced: React.PropTypes.oneOfType([
    PropTypes.bool,                     // `true` = space
    PropTypes.string,                   // `left`, `right`,
  ]),

  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUIImages.render = Function.prototype;

export default SUIImages;

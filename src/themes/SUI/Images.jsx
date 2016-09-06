//////////////////////////////
//
//  <Images> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import { addElements } from "./SUI";
import { getFloatedClass, getAlignClass, getSpacedClass } from "./constants";

function SUIImages(props, context) {
  const {
    // content
    children,
    // appearance
    className, appearance, size, floated, align, spaced,
    // state & events
    hidden, disabled,
    // everything else including id and style
    ...ImagesProps
  } = props;

  ImagesProps.className = classNames(
    "ui", appearance, size,
    getFloatedClass(floated), getSpacedClass(spaced), getAlignClass(align),
    { hidden, disabled },
    "images");

  return <span {...ImagesProps}>{children}</span>;
}

SUIImages.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  size: PropTypes.string,   // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
  floated: PropTypes.string,
  align: PropTypes.string,
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

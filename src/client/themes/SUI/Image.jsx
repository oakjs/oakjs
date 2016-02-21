//////////////////////////////
//
//	<Image> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import { getFloatedClass, getAlignClass, getSpacedClass } from "./constants";
import "./Image.css";

function SUIImage(props) {
  const {
    // content
    src, children,
    // appearance
    className, appearance, inline, size, floated, align, spaced,
    // state & events
    hidden, disabled,
    // everything else including id and style
    ...imageProps
  } = props;

  imageProps.className = classNames(
          className, "ui", appearance, size,
          getFloatedClass(floated), getSpacedClass(spaced), getAlignClass(align),
          { inline, hidden, disabled },
          "image");

  if (children) {
    const imageElement = <img src={src}/>;
    return <div {...imageProps}>{imageElement}{children}</div>;
  }
  else {
    imageProps.src = src;
    return <img {...imageProps}/>
  }
}

SUIImage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  src: PropTypes.string,

  appearance: PropTypes.string,
  inline: PropTypes.bool,               // `true` == inline block
  size: PropTypes.string,               // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
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
SUIImage.render = Function.prototype;

export default SUIImage;

// Method to render an image iff we're passed one, otherwise returns `undefined`.
export function renderImage(src, props={}) {
  if (!src) return undefined;
  return <SUIImage src={src} {...props}/>;
}

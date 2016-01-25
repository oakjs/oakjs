//////////////////////////////
//
//	<Image> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Image.css";

export const FLOAT_CLASS_MAP = {
  left: "left floated",
  right: "right floated",
  [true]: "floated"
}

export const VALIGN_CLASS_MAP = {
  top: "top aligned",
  middle: "middle aligned",
  bottom: "bottom aligned",
}

export const SPACED_CLASS_MAP = {
  left: "left spaced",
  right: "right spaced",
  [true]: "spaced"
}

function SUIImage(props) {
  const {
    // content
    src, children,
    // appearance
    className, appearance, inline, size, floated, valign, spaced,
    // state & events
    hidden, disabled,
    // everything else including id and style
    ...imageProps
  } = props;

  const classProps = {
    inline,
    hidden,
    disabled,
  }
  if (floated) classProps[FLOAT_CLASS_MAP[floated]] = true;
  if (spaced) classProps[SPACED_CLASS_MAP[spaced]] = true;
  if (valign) classProps[VALIGN_CLASS_MAP[valign]] = true;
  imageProps.className = classNames("ui", appearance, size, classProps, "image");

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
  valign: PropTypes.string,
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

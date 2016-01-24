//////////////////////////////
//
//	<Image> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export function getImageClassName(props) {
  const { className, appearance, size, hidden, disabled, float, valign, spaced } = props;

  const classProps = {
    hidden,
    disabled,
    [`${float} floated`] : float,
    [`${valign} aligned`] : valign,
  }
  if (spaced) {
    if (spaced === true) classProps.spaced = true;
    else classProps[`${spaced} spaced`] = true;
  }
  return classNames("ui", appearance, size, classProps, "image");
}

function SUIImage(props) {
  const { id, style, appearance, src } = props;
  const imageProps = {
    id,
    className: getImageClassName(props),
    style,
    src
  }
  return <img {...imageProps}/>
}

SUIImage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  src: PropTypes.string,

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
SUIImage.render = Function.prototype;

export default SUIImage;

// Method to render an image iff we're passed one, otherwise returns `undefined`.
export function renderImage(src, props={}) {
  if (!src) return undefined;
  return <SUIImage src={src} {...props}/>;
}

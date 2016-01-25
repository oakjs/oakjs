//////////////////////////////
//
//	<Label> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import "./Label.css";

export function getLabelClassName(props) {
  const { className, appearance, size, hidden, disabled, float, valign, pointing, spaced } = props;

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
  if (pointing) {
    if (pointing === true) classProps.pointing = true;
    else if (pointing === "up") classProps["pointing"] = true;
    else if (pointing === "down") classProps["pointing below"] = true;
    else classProps[`${pointing} pointing`] = true;
  }
  return classNames("ui", appearance, size, classProps, "label");
}

function SUILabel(props) {
  const { id, style, children } = props;
  const imageProps = {
    id,
    className: getLabelClassName(props),
    style,
  }
  return <span {...imageProps}>{children}</span>
}

SUILabel.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  size: PropTypes.string,   // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  float: PropTypes.string,
  valign: PropTypes.string,
  pointing: React.PropTypes.oneOfType([
    PropTypes.bool,                     // `true` = above
    PropTypes.string,                   // `left`, `right`, `above`, `below`, `up`, `down`
  ]),
  spaced: React.PropTypes.oneOfType([
    PropTypes.bool,                     // `true` = space
    PropTypes.string,                   // `left`, `right`,
  ]),
};

// add render() method so we get hot code reload.
SUILabel.render = Function.prototype;

export default SUILabel;

// Method to render an image iff we're passed one, otherwise returns `undefined`.
export function renderLabel(src, props={}) {
  if (!src) return undefined;
  return <SUILabel src={src} {...props}/>;
}

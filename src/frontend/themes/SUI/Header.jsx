"use strict"
//////////////////////////////
//
//  <Header> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { renderIcon } from "./Icon";

export const HEADER_SIZE_MAP = {
  "huge": "h1",
  "large": "h2",
  "medium": "h3",
  "small": "h4",
  "tiny": "h5",
}

export function getHeaderProps(props) {
  const { id, className, style, appearance, disabled, dividing, sub, align, float, size="medium", color, attached } = props;

  const classProps = {
    disabled,
    dividing,
    [`${align} aligned`] : align,
    [`${float} floated`] : float,
    sub,
  };

  if (attached) {
    if (attached === true) classProps.attached = true;
    else classProps[`${attached} attached`] = true;
  }

  return {
    id,
    className: classNames(className, "ui", size, color, appearance, classProps, "header"),
    style,
  }
}

export function getHeaderTagName(props) {
  if (props.page) return HEADER_SIZE_MAP[props.size] || HEADER_SIZE_MAP.medium;
  return "div";
}

function getImageOrIcon(props) {
  const { icon, image, imageAppearance } = props;
  if (icon) return renderIcon(icon);
  if (image) return <img src={image} className={imageAppearance}/>;
  return undefined;
}

function SUIHeader(props) {
  const { children } = props;
  const tagName = getHeaderTagName(props);
  const headerProps = getHeaderProps(props);
  const decoration = getImageOrIcon(props);
  const content = (decoration ? <div className="content">{children}</div> : children);
  return React.createElement(tagName, headerProps, decoration, content);
}

SUIHeader.defaultProps = {
  imageAppearance: "ui image"
}

SUIHeader.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,         // `block`, `inverted`,
  disabled: PropTypes.bool,
  dividing: PropTypes.bool,
  page: PropTypes.bool,                 // true = page header
  sub: PropTypes.bool,                  // true = sub header
  align: PropTypes.string,              // `left`, `centered`, `right`, `justified`
  float: PropTypes.string,              // `left` or `right`
  size: PropTypes.string,               // `tiny`, `small`, `medium`, `large`, `huge`
  color: PropTypes.string,              // `red`, etc
  icon: PropTypes.string,               // `red`, etc
  image: PropTypes.string,              // image src
  imageAppearance: PropTypes.string,    // eg: "ui image" or "ui circular image"
  attached: React.PropTypes.oneOfType([
    PropTypes.bool,                     // `true` = center attached
    PropTypes.string,                   // `top`, `bottom`,
  ]),
};

// add render() method so we get hot code reload.
SUIHeader.render = Function.prototype;

export default SUIHeader;



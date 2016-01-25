"use strict"
//////////////////////////////
//
//  <Header> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { addElements, addElementsOn } from "./SUI";
import Icon from "./Icon";

export const HEADER_SIZE_MAP = {
  "huge": "h1",
  "large": "h2",
  "medium": "h3",
  "small": "h4",
  "tiny": "h5",
}

export function getHeaderProps(props) {
  const { id, className, style, appearance, disabled, dividing, sub, align, floated, size="medium", color, attached } = props;

  const classProps = {
    disabled,
    dividing,
    [`${align} aligned`] : align,
    [`${floated} floated`] : floated,
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
  if (icon) return <Icon icon={icon}/>;
  if (image) return <img src={image} className={imageAppearance}/>;
  return undefined;
}

function SUIHeader(props) {
  const { children } = props;
  const tagName = getHeaderTagName(props);
  const headerProps = getHeaderProps(props);

  let elements = addElements(children);
  // if we got decorations, wrap content in <div.content>
  const decoration = getImageOrIcon(props);
  if (decoration) elements = addElements(decoration, <div className="content">{children}</div>);

  return React.createElement(tagName, headerProps, ...elements);
}

SUIHeader.defaultProps = {
  size: "medium",
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
  floated: PropTypes.string,              // `left` or `right`
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



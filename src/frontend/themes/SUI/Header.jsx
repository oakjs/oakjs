"use strict"
//////////////////////////////
//
//  <Header> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";
import { getAlignClass, getFloatedClass, getHeaderClass } from "./constants";
import Icon from "./Icon";

function SUIHeader(props) {
  const {
    // content
    content, children, icon, image, imageAppearance,
    // appearance
    appearance, page, align, floated, size, color, dividing, sub,
    // state
    disabled,
    // everything else including id, className, style
    ...elementProps
  } = props;

  const elements = new ElementBuffer({
    type: (page ? getHeaderClass(size) : "div"),
    props: elementProps
  });
  elements.addClass("ui", appearance, size, color, getAlignClass(align), getFloatedClass(floated));
  elements.addClass({ disabled, dividing, sub });
  elements.addClass("header");

  elements.append(content, children);

  let decoration;
  if (icon) decoration = <Icon icon={icon}/>;
  else if (image) decoration = <img src={image} className={imageAppearance}/>;

  if (decoration) {
    elements.wrap("div", { className: "content" });
    elements.prepend(decoration);
  }

  return elements.render();
}

SUIHeader.defaultProps = {
  size: "medium",
  imageAppearance: "ui image"
}

SUIHeader.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  content: PropTypes.any,
  children: PropTypes.any,
  icon: PropTypes.string,               // `red`, etc
  image: PropTypes.string,              // image src
  imageAppearance: PropTypes.string,    // eg: "ui image" or "ui circular image"

  appearance: PropTypes.string,         // `block`, `inverted`,
  dividing: PropTypes.bool,
  page: PropTypes.bool,                 // true = page header
  sub: PropTypes.bool,                  // true = sub header
  align: PropTypes.string,              // `left`, `centered`, `right`, `justified`
  floated: PropTypes.string,              // `left` or `right`
  size: PropTypes.string,               // `tiny`, `small`, `medium`, `large`, `huge`
  color: PropTypes.string,              // `red`, etc

  disabled: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUIHeader.render = Function.prototype;

export default SUIHeader;



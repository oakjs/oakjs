//////////////////////////////
//
//	<Label> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { addElements, addElementsOn } from "./SUI";
import Icon from "./Icon";
import "./Label.css";

export const POINTING_CLASS_MAP = {
  above: "pointing",
  below: "pointing below",
  right: "right pointing",
  left: "left pointing",
  up: "pointing",
  down: "pointing below"
}

function SUILabel(props) {
  const {
    // allow for different tag names to be used (default is "label")
    tagName,
    // content
    content, detail, icon, iconOn, image, imageOn, children,
    // appearance
    className, appearance, color, size, floating, pointing,
    // state & events
    hidden, disabled, active, closable, onClose,
    // everything else including id and style
    ...labelProps
  } = props;

  // put content before children ???
  let elements = addElements(content, children);

  // class name bits
  const classProps = {
    hidden,
    disabled,
    active,
    floating,
  }

  if (pointing) {
    const pointingClass = POINTING_CLASS_MAP[pointing] || POINTING_CLASS_MAP.above;
    classProps[pointingClass] = true;
  }

  if (icon) {
    const iconElement = <Icon icon={icon}/>;
    elements = addElementsOn(iconOn, iconElement, elements);
    const iconClass = (iconOn === "right" ? "right icon" : "icon");
    classProps[iconClass] = true;
  }

  if (image) {
    const imageElement = <img src={image}/>;
    elements = addElementsOn(imageOn, imageElement, elements);
    const imageClass = (imageOn === "right" ? "right image" : "image");
    classProps[imageClass] = true;
  }

  if (detail) {
    const detailElement = <div className="detail">{detail}</div>;
    elements = addElements(elements, detailElement);
  }

  if (closable) {
    const closerElement = <Icon icon="delete" onClick={onClose}/>
    elements = addElements(elements, closerElement);
    classProps.closable = true;
  }

  labelProps.className = classNames(className, "ui", appearance, color, size, classProps, "label");
  return React.createElement(tagName, labelProps, ...elements);
}

SUILabel.defaultProps = {
  tagName: "label"
}

SUILabel.propTypes = {
  tagName: PropTypes.string,            // eg: "span" or "label"
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  content: PropTypes.string,            // specify `content` as alternative or adjunct to providing `children`
  detail: PropTypes.string,             // nested <detail> element
  icon: PropTypes.string,
  iconOn: PropTypes.string,             // "left" (default) or "right"
  image: PropTypes.string,
  imageOn: PropTypes.string,             // "left" (default) or "right"

  appearance: PropTypes.string,
  color: PropTypes.string,              // `red`, etc
  size: PropTypes.string,               // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
  floating: PropTypes.bool,
  pointing: React.PropTypes.oneOfType([
    PropTypes.bool,                     // `true` = above
    PropTypes.string,                   // `left`, `right`, `above`, `below`, `up`, `down`
  ]),

  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  closable: PropTypes.bool,             // if true, we show a `delete` icon (x) on the right
  onClose: PropTypes.func               // invoked if close icon is clicked
};

// add render() method so we get hot code reload.
SUILabel.render = Function.prototype;

export default SUILabel;

// Method to render an image iff we're passed one, otherwise returns `undefined`.
export function renderLabel(src, props={}) {
  if (!src) return undefined;
  return <SUILabel src={src} {...props}/>;
}

//////////////////////////////
//
//	<ListItem> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import { addElements, addElementsOn } from "./SUI";
import Icon from "./Icon";

export const ALIGN_CLASS_MAP = {
  top: "top aligned",
  middle: "middle aligned",
  bottom: "bottom aligned",
}

function defaultTagName(props) {
  if (props.tagName) return props.tagName;
  if (props.href) return "a";
  return "div";
}

function SUIListItem(props) {
  const {
    // allow for different tag names to be used (default is "ListItem")
    tagName,
    // content
    content, header, description, children,
    // decorators
    icon, image, imageAppearance,
    // appearance
    className, appearance, size, align, nestChildren={false},
    // state & events
    hidden, disabled, active,
    // everything else including id, style, href, target
    ...itemProps
  } = props;

  const headerElement = (header && <div className="header">{header}</div>);
  const descriptionElement = (description && <div className="description">{description}</div>);
  let elements = addElements(headerElement, descriptionElement, content)

  const contentProps = {
    className: classNames(ALIGN_CLASS_MAP[align], "content")
  };

  if (nestChildren) {
    elements = [React.createElement("div", contentProps, ...addElements(elements, children))];
  }
  else {
    elements = [React.createElement("div", contentProps, ...elements)];
    elements = addElements(elements, children);
  }

  // add icon BEFORE content
  if (icon) {
    const iconElement = <Icon icon={icon}/>;
    elements = addElements(iconElement, elements);
  }

  // add image BEFORE content
  if (image) {
    const imageProps = {
      src: image,
      className: classNames("ui", imageAppearance, "image")
    }
    const imageElement = <img {...imageProps}/>;
    elements = addElements(imageElement, elements);
  }

  // class name bits
  const classProps = {
    hidden,
    disabled,
    active,
  }
  itemProps.className = classNames(className, appearance, size, classProps, "item");

  return React.createElement(defaultTagName(props), itemProps, ...elements);
}

SUIListItem.defaultProps = {
  nestChildren: true
}

SUIListItem.propTypes = {
  tagName: PropTypes.string,            // eg: "div" or "li"
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  content: PropTypes.string,            // specify `content` as alternative or adjunct to providing `children`
  header: PropTypes.string,             // nested <header> element
  description: PropTypes.string,        // nested <description> element
  icon: PropTypes.string,
  image: PropTypes.string,
  imageAppearance: PropTypes.string,
  href: PropTypes.string,                // if set, ENTIRE item will be an anchor.
  target: PropTypes.string,              // target for href

  appearance: PropTypes.string,
  size: PropTypes.string,               // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
  align: PropTypes.string,              // `top`, `middle`, `bottom`
  nestChildren: PropTypes.bool,          // necessary if you've got a nested bulleted or ordered list...???

  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  closable: PropTypes.bool,             // if true, we show a `delete` icon (x) on the right
  onClose: PropTypes.func               // invoked if close icon is clicked
};

// add render() method so we get hot code reload.
SUIListItem.render = Function.prototype;

export default SUIListItem;

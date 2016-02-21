//////////////////////////////
//
//	<ListItem> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import ElementBuffer from "./ElementBuffer";
import { getAlignClass } from "./constants";

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
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    type: defaultTagName(props),
    props: {
      ...extraProps,
      className: [ className, appearance, size, { hidden, disabled, active }, "item" ]
    }
  });

  if (header) elements.appendWrapped("div", "header", header);
  if (description) elements.appendWrapped("div", "description", description);
  if (content) elements.append(content);

  const contentProps = {
    className: classNames(getAlignClass(align), "content")
  };

  if (nestChildren) {
    elements.append(children);
    elements.wrap("div", contentProps);
  }
  else {
    elements.wrap("div", contentProps);
    elements.append(children);
  }

  // add icon BEFORE content
  if (icon) elements.prependIcon(icon);

  // add image BEFORE content
  if (image) elements.prependImage(image, classNames("ui", imageAppearance, "image"));

  return elements.render();
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
};

// add render() method so we get hot code reload.
SUIListItem.render = Function.prototype;

export default SUIListItem;

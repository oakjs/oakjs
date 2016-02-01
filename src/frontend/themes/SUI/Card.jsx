//////////////////////////////
//
//	<Card> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";

import "./Card.css";

function SUICard(props) {
  const {
    // content
    header, headerImage, description, meta, extra,
    // children
    image, children, childrenOn,
    // appearance
    className, appearance, size, align,
    // link functionality
    href,
    // state & events
    hidden, disabled, active,
    // everything else including id, style, target
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props: {
      ...extraProps,
      className: [ className, "ui", appearance, size, { hidden, disabled, active }, "card" ],
      href
    }
  });

  if (header) elements.appendWrapped("div", "header", header);
  if (headerImage) elements.appendImage(image);
  if (meta) elements.appendWrapped("div", "meta", meta);
  if (description) elements.appendWrapped("div", "description", description);

  // wrap the above in a content block
  if (!elements.isEmpty) elements.wrap("div", "content");

  if (image) {
    const imageElement = elements.createImage(image);
    if (imageElement) elements.prependWrapped("div", "image", imageElement);
  }

  // add children bareback
  if (children) elements.addOn(childrenOn, children);

  if (extra) elements.appendWrapped("div", "extra content", extra);

  return elements.render();
}

SUICard.defaultProps = {
  childrenOn: "bottom"
}

SUICard.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  header: PropTypes.any,                // nested <header> element
  headerImage: PropTypes.any,           // image specifically formatted for header section
  description: PropTypes.any,           // nested <description> element
  meta: PropTypes.any,                  // nested <meta> element
  extra: PropTypes.any,                 // "extra content" element

  image: PropTypes.any,                 // image in the header section
  children: PropTypes.any,
  childrenOn: PropTypes.string,         // "top" or "bottom"

  href: PropTypes.string,               // if set, ENTIRE item will be an anchor.
  target: PropTypes.string,             // target for href

  appearance: PropTypes.string,
  size: PropTypes.string,                // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
  align: PropTypes.string,               // `top`, `middle`, `bottom`
  nestChildren: PropTypes.bool,          // necessary if you've got a nested bulleted or ordered list...???

  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
};

// add render() method so we get hot code reload.
SUICard.render = Function.prototype;

export default SUICard;


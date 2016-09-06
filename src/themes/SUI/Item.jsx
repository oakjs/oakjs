//////////////////////////////
//
//  <Item> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import ElementBuffer from "./ElementBuffer";
import SUIComponent from "./SUIComponent";

import { getAlignClass } from "./constants";

import "./Item.css";

const Item = class SUIItem extends SUIComponent {
  static defaultProps = {
    imageAppearance: "small",
    align: "middle"
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    header: PropTypes.any,                // nested <header> element
    content: PropTypes.any,               // nested <description> element
    meta: PropTypes.any,                  // nested <meta> element
    extra: PropTypes.any,                 // "extra content" element

    image: PropTypes.any,                 // image in the header section
    imageAppearance: PropTypes.string,    // image appearance

    children: PropTypes.any,

    appearance: PropTypes.string,
    align: PropTypes.string,              // "bottom", "middle", "top"

    onClick: PropTypes.func
  };

  render() {
    const {
      id, className, style,
      image, imageAppearance, header, content, meta, extra, children,
      appearance, align,
      onClick,
    } = this.props;

    const elements = new ElementBuffer({
      props: {
        ...this.getUnknownProps(),
        id,
        style,
        className: [ className, appearance, { clickable: onClick } ],
        onClick
      }
    });

    if (header) elements.appendWrapped("div", "header", header);
    if (meta) elements.appendWrapped("div", "meta", meta);
    if (content) elements.appendWrapped("div", "description", content);
    if (extra) elements.appendWrapped("div", "extra", extra);

    // wrap the above in a content block
    if (!elements.isEmpty) {
      const className = classNames( getAlignClass(align), "content");
      elements.wrap("div", className);
    }

    // add children bareback
    if (children) elements.append(children);

    // add image BEFORE the content block and children
    if (image) {
      const imageElement = elements.createImage(image);
      elements.prependWrapped("div", classNames("ui", imageAppearance, "image"), imageElement);
    }

    // add "item" at the end of the class names
    elements.addClass("item");
    return elements.render();
  }
}

export default Item;


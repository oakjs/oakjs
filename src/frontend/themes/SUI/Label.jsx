//////////////////////////////
//
//	<Label> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import SUIComponent from "./SUIComponent";
import ElementBuffer from "./ElementBuffer";
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

const Label = class SUILabel extends SUIComponent {
  static defaultProps = {
    ...SUIComponent.defaultProps,
    tagName: "label",
    iconOn: "left",
    imageOn: "left"
  }

  static propTypes = {
    ...SUIComponent.propTypes,
    tagName: PropTypes.string,            // eg: "label" or "span", etc

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

    active: PropTypes.bool,
    closable: PropTypes.bool,             // if true, we show a `delete` icon (x) on the right
    onClose: PropTypes.func               // invoked if close icon is clicked
  };

  //////////////////////////////
  // `content` and `detail` are dynamically overrideable in state
  //////////////////////////////
  get content() { return this.get("content") }
  set content(newValue) { return this.set("content", newValue) }

  get detail() { return this.get("detail") }
  set detail(newValue) { return this.set("detail", newValue) }


  //////////////////////////////
  // Rendering
  //////////////////////////////


  render() {
    // Non-state-overrideable properties
    const {
      // standard element stuff
      tagName, id, style, className,
      // content
      icon, iconOn, image, imageOn, children,
      // appearance
      appearance, color, size, floating, pointing,
      // state & events
      active, closable, onClose
    } = this.props;

    // State-overriddeable properties
    const { visible, disabled, content, detail } = this;

    const elements = new ElementBuffer({
      type: tagName,
      props: {
        ...this.getUnknownProperties(),
        id,
        style,
        className: [className, "ui", appearance, color, size, { hidden: !visible, disabled, active, floating }]
      }
    });

    // add content and childrem
    elements.append(content, children);

    if (pointing) {
      elements.addClass(POINTING_CLASS_MAP[pointing] || POINTING_CLASS_MAP.above);
    }

    if (icon) {
      elements.addIconOn(iconOn, icon);
      elements.addClass(iconOn === "right" ? "right icon" : "icon");
    }

    if (image) {
      elements.addOn(imageOn, <img src={image}/>);
      elements.addClass(imageOn === "right" ? "right image" : "image");
    }

    if (detail) {
      elements.append(<div className="detail">{detail}</div>);
    }

    if (closable) {
      elements.append(<Icon icon="delete" onClick={onClose}/>);
      elements.addClass("closable");
    }

    // add "label" at the end of the classNames
    elements.addClass("label");
    return elements.render();
  }
}

export default Label;

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

import { getFloatedClass } from "./constants";

import "./Label.css";


const Label = class SUILabel extends SUIComponent {
  static defaultProps = {
    ...SUIComponent.defaultProps,
    visible: true,
    tagName: "label",
    iconOn: "left",
    imageOn: "left"
  }

  static propTypes = {
    ...SUIComponent.propTypes,
    tagName: PropTypes.string,            // eg: "label" or "span", etc

    content: PropTypes.any,            // specify `content` as alternative or adjunct to providing `children`
    detail: PropTypes.any,             // nested <detail> element
    icon: PropTypes.any,
    iconOn: PropTypes.string,             // "left" (default) or "right"
    image: PropTypes.any,
    imageOn: PropTypes.string,             // "left" (default) or "right"

    appearance: PropTypes.string,
    color: PropTypes.string,              // `red`, etc
    size: PropTypes.string,               // `mini`, `tiny`, `small`, `medium`, `large`, `big`, `huge`, `massive`
    floating: PropTypes.bool,
    pointing: React.PropTypes.oneOfType([
      PropTypes.bool,                     // `true` = above
      PropTypes.string,                   // `left`, `right`, `above`, `below`, `up`, `down`
    ]),

    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    closable: PropTypes.bool,             // if true, we show a `delete` icon (x) on the right
    onClose: PropTypes.func               // invoked if close icon is clicked
  };

  //////////////////////////////
  // Rendering
  //////////////////////////////


  render() {
    // Non-state-overrideable properties
    const {
      // standard element stuff
      tagName, id, style, className,
      // content
      content, detail, icon, iconOn, image, imageOn, children,
      // appearance
      appearance, color, size, floating, pointing,
      // state & events
      visible, disabled, active, closable, onClose
    } = this.props;

    const elements = new ElementBuffer({
      type: tagName,
      props: {
        ...this.getUnknownProps(),
        id,
        style,
        className: [className, "ui", appearance, color, size, { hidden: !visible, disabled, active, floating }]
      }
    });

    // add content and childrem
    elements.append(content, children);

    if (pointing) {
      elements.addClass(getPointingClass(pointing) || getPointingClass("above"));
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

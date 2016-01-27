//////////////////////////////
//
//	<Message> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";
import OverrideableComponent from "./OverrideableComponent";
import "./Message.css";

export default class SUIMessage extends OverrideableComponent {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    header: PropTypes.string,
    message: PropTypes.string,
    children: PropTypes.any,

    appearance: PropTypes.string,
    color: PropTypes.string,
    inline: PropTypes.bool,
    floated: PropTypes.string,
  };

  flash(message, duration=1000) {
    this.set({ message });
    setTimeout(this.constructor.set(this.props.id, {message:""}), duration);
  }
  static flash(id, message) {
    return () => {
      const component = this.get(id)
      if (component) component.flash(message);
    }
  }

  render() {
    const {
      id, style, className,
      header, message, children,
      appearance, color, inline, floated
    } = this.getAll();

    const elements = new ElementBuffer();
    if (header) elements.append(<div className="header">{header}</div>);
    if (message) elements.append(message);
    if (children) elements.append(children)

    const classProps = { inline };
    if (floated) classProps[`${floated} floated`] = true;

    elements.props = {
      id,
      className: [className, "ui", color, appearance, classProps, "message"],
      style
    }
    return elements.render();
  }
}

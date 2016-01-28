//////////////////////////////
//
//	<Message> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";
import { autobind } from "core-decorators";

import SUIComponent from "./SUIComponent";
import ElementBuffer from "./ElementBuffer";
import Icon from "./Icon";
import "./Message.css";


const Message = class SUIMessage extends SUIComponent {
  static propTypes = {
    ...SUIComponent.propTypes,
    header: PropTypes.string,
    message: PropTypes.string,

    appearance: PropTypes.string,   // "compact", "attached", "bottom attached"
                                    // "warning", "info", "positive", "success", "negative", "error"
    icon: PropTypes.string,
    color: PropTypes.string,        // "red", etc...
    size: PropTypes.string,

    closable: PropTypes.bool,
    onClose: PropTypes.func
  };

  //////////////////////////////
  // Header and message are dynamically overrideable in state
  //////////////////////////////
  get header() { return this.get("header") }
  set header(newValue) { return this.set("header", newValue) }

  get message() { return this.get("message") }
  set message(newValue) { return this.set("message", newValue) }


  //////////////////////////////
  // Event handling
  //////////////////////////////

  @autobind
  onCloserClick(event) {
    const { onClose } = this.props;
    // if we have an onClose event, call that first
    if (onClose) {
      onClose(event, this);
      if (event.defaultPrevented) return;
      // and bail if that prevents default
    }

    this.hide();
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    // get non-overrideable props
    const {
      id, style, className,
      children,
      appearance, size, icon, color, inline, floated,
      closable
    } = this.props;

    // get overrideable props
    const { visible, header, message } = this;

    const elements = new ElementBuffer({
      props: {
        ...this.getUnknownProperties(),
        id,
        style,
        className: [className, "ui", color, size, appearance, { visible, hidden: !visible, inline }, "message"],
      }
    });
    if (floated) elements.addClass(`${floated} floated`);

    if (header) elements.append(<div className="header">{header}</div>);
    if (message) elements.append(message);
    if (children) elements.append(children)
    // wrap the above in a "content" div
    if (!elements.isEmpty) elements.wrap("div", { className: "content" })

    // add icon before the content
    if (icon) elements.prepend(<Icon icon={icon}/>);

    // if closeable, add close icon before everything else
    if (closable) elements.prepend(<Icon icon="close" onClick={this.onCloserClick}/>);

    // add "message" at the end of the class name
    elements.addClass("message");
    return elements.render();
  }
}

export default Message;

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
    content: PropTypes.string,

    appearance: PropTypes.string,   // "compact", "attached", "bottom attached"
                                    // "warning", "info", "positive", "success", "negative", "error"
    icon: PropTypes.string,
    color: PropTypes.string,        // "red", etc...
    size: PropTypes.string,

    closable: PropTypes.bool,
    onClose: PropTypes.func
  };

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
      header, content, children,
      appearance, size, icon, color, inline, floated,
      visible, closable
    } = this.props;

    const elements = new ElementBuffer({
      props: {
        ...this.getUnknownProps(),
        id,
        style,
        className: [className, "ui", color, size, appearance, { hidden: !visible, inline, icon }],
      }
    });
    if (floated) elements.addClass(`${floated} floated`);

    if (header) elements.append(<div className="header">{header}</div>);
    if (content) elements.append(content);
    if (children) elements.append(children)
    // wrap the above in a "content" div
    if (!elements.isEmpty) elements.wrap("div", { className: "content" })

    // add icon before the content
    if (icon) elements.prependIcon(icon);

    // if closeable, add close icon before everything else
    if (closable) elements.prepend(<Icon icon="close" onClick={this.onCloserClick}/>);

    // add "content" at the end of the class name
    elements.addClass("message");
    return elements.render();
  }
}

export default Message;

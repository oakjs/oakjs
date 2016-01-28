//////////////////////////////
//
//	<Message> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";
import "./Message.css";


const Message = function SUIMessage(props, context) {
  const {
    id, style, className,
    header, message, children,
    appearance, color, inline, floated
  } = props;

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

Message.propTypes = {
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

// add render() method so we get hot code reload.
Message.render = Function.prototype;


export default Message;

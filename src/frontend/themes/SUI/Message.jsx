//////////////////////////////
//
//	<Message> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default function Message(props) {
  const { id, className, appearance, inline, style={}, children } = props;

  const groupProps = {
    id,
    className: classNames(className, "ui", appearance, "message"),
    style
  }
  if (inline) style.display = "inline-block";

  return <div {...groupProps}>{renderHeader(props)}{renderMessage(props)}{children}</div>;
}

Message.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  appearance: PropTypes.string,
  inline: PropTypes.bool,
  style: PropTypes.object,

  header: PropTypes.string,
  message: PropTypes.string
};

function renderHeader(props) {
  const { header } = props;
  if (header) return <div className="header">{header}</div>;
  return undefined;
}

function renderMessage(props) {
  const { message } = props;
  if (message) return <p>{message}</p>;
  return undefined;
}

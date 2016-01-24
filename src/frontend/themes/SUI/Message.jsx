//////////////////////////////
//
//	<Message> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

export default class SUIMessage extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    appearance: PropTypes.string,
    color: PropTypes.string,
    inline: PropTypes.bool,
    style: PropTypes.object,

    header: PropTypes.string,
    message: PropTypes.string
  };

  renderHeader() {
    const { header } = this.props;
    if (header) return <div className="header">{header}</div>;
    return undefined;
  }

  renderMessage() {
    const { message } = this.props;
    if (message) return <p>{message}</p>;
    return undefined;
  }

  render() {
    const { id, className, appearance, color, inline, style={}, children } = this.props;

    const props = {
      id,
      className: classNames(className, "ui", color, appearance, "message"),
      style
    }
    if (inline) style.display = "inline-block";

    return (
      <div {...props}>
        {this.renderHeader()}
        {this.renderMessage()}
        {children}
      </div>
    );
  }
}

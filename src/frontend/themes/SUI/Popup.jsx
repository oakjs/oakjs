"use strict";

//////////////////////////////
//
//  <Popup> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import SUIComponent from "./SUIComponent";

export default class SUIPopup extends SUIComponent {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    appearance: PropTypes.string,

    title: PropTypes.string,
    content: PropTypes.string
  };

  //////////////////////////////
  //  Lifecycle
  //////////////////////////////

  // Return the popup target element as a jQuery vector.
  getTarget() {
    const { target } = this.props;
    if (typeof target === "string") return $(target);

    // if not found, return the previous sibling element.
    return this.$ref().prev();
  }

  componentDidMount() {
    const $target = this.getTarget();
    if ($target) $target.popup({ popup: this.$ref() });
  }

  //////////////////////////////
  //  Rendering
  //////////////////////////////

  render() {
    const { id, className, style, appearance, title, content, children } = this.props;
    const props = {
      id,
      className: classNames(className, "ui", appearance, "popup"),
      style,
    };
    return (
      <div {...props}>
        {title && <div className="header">{title}</div>}
        {content && <div>{content}</div>}
        {children}
      </div>
    );
  }
}

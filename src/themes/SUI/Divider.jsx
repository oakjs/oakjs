"use strict";
//////////////////////////////
//  <Divider> component
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import ElementBuffer from "./ElementBuffer";

function SUIDivider(props) {
  const {
    id, className, style,
    title, icon, children,
    appearance, vertical, horizontal, header, size, clearing,
    ...extraProps
  } = props;


  const elements = new ElementBuffer({
    type: (header ? "h4" : "div"),
    props: {
      ...extraProps,
      id,
      style,
      className: [className, "ui", { vertical, horizontal, clearing, header }, size, appearance, "divider"]
    }
  });

  if (title) elements.append(title);
  if (children) elements.append(children);
  if (icon) elements.appendIcon(icon);

  return elements.render();
}

SUIDivider.defaultProps = {
  clearing: true
}

SUIDivider.PropTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  appearance: PropTypes.string,
  vertical: PropTypes.bool,
  horizontal: PropTypes.bool,
  header: PropTypes.bool,
  size: PropTypes.string,         // `tiny`, `small`, `medium`, `large`, `huge`
  title: PropTypes.string,
  icon: PropTypes.string,
  clearing: PropTypes.bool
};

// add render() method so we get hot code reload.
SUIDivider.render = Function.prototype;

export default SUIDivider;

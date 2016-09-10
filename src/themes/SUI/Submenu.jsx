"use strict";
//////////////////////////////
//
//  <Submenu> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import ElementBuffer from "./ElementBuffer";
import { isElement } from "./SUI";

import { renderItems } from "./Menu";

import "./Menu.css";

function SUISubmenu(props, context) {
  if (props.hidden) return null;
  let {
    label, items, children,
    hidden, className, appearance, disabled,
    // including id, style
    ...extraProps
  } = props;

  if (hidden) return null;

  const elements = new ElementBuffer({
    props : {
      ...extraProps,
      className: [className, "ui", "simple", appearance, { disabled }, "dropdown item"]
    }
  });

  elements.appendIcon("dropdown");

  if (label) {
    elements.append(label);
  }
  else if (typeof children === "string") {
    elements.appendWrapped("div", "text", children);
    children = null;
  }
  // if first item in children is a string, use that as the label
  else if (children && children.length && typeof children[0] === "string") {
    const childLabel = children.shift();
    elements.appendWrapped("div", "text", childLabel);
  }

// TODO: don't append menu until shown????

  // if we got a `menu`, use that as our submenu
  if (items) {
    const menuItems = renderItems(items);
    if (menuItems) elements.appendWrapped("div", "menu", menuItems);
  }
  // otherwise assume that they've embedded a <Menu> ???
  // TODO: allow them to embed simply <MenuItems> ???
  else if (children) {
    elements.append(children);
  }

  return elements.render();
}

SUISubmenu.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  label: PropTypes.string,
  items: PropTypes.any,
  children: PropTypes.any,

  appearance: PropTypes.string,
  disabled: PropTypes.bool,
};

// Add a render method so we get hot reload.
SUISubmenu.render = Function.prototype;

export default SUISubmenu;

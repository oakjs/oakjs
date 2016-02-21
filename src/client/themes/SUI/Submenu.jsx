"use strict";
//////////////////////////////
//
//  <Submenu> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "oak-roots/util/react";

import ElementBuffer from "./ElementBuffer";
import { isElement } from "./SUI";

import { renderItems } from "./Menu";

import "./Menu.css";

function SUISubmenu(props, context) {
  const {
    label, items, children,
    className, appearance, disabled,
    // including id, style
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : {
      ...extraProps,
      className: [className, "ui", appearance, { disabled }, "dropdown item"]
    }
  });

  if (label) {
    elements.append(label);
  }
  // if first item in children is a string, use that as the label
  else if (children && children.length && typeof children[0] === "string") {
    const childLabel = children.shift();
    elements.append(childLabel);
  }

  elements.appendIcon("dropdown");

  const menuItems = children || renderItems(items);
  if (!menuItems) console.warn("SubMenu.render(): neither children nor items returned anything", children, items);
  elements.appendWrapped("div", "menu", menuItems);

  return elements.render();
}

SUISubmenu.defaultProps = {
  // having the "simple" appeareance means the submenu will show automatically
  appearance: "simple"
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

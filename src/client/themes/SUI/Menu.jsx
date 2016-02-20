"use strict";
//////////////////////////////
//
//  <Menu> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";
import { isElement } from "./SUI";
import { getItemCountClass } from "./constants";

import MenuItem from "./MenuItem";
import MenuHeader from "./MenuHeader";
import Divider from "./Divider";

import "./Menu.css";

// Render a set of items as:
//  - a delimited string list
//  - an array of `string` or `{value, label}` pairs
//  - a map of `{value:label}`.
// Returns an array of MenuItem or MenuHeaders etc.
export function renderItems(items) {
  if (!items) return undefined;

  if (Array.isArray(items))
    return renderItemsArray(items);

  return renderItemsMap(items);
}

export function renderItemsArray(items) {
  return items.map(item => {
    if (!item) return undefined;

    // if we got a react element, just return it
    if (isElement(item)) return item;

    // If we got a string, return a simple menuItem
    if (typeof item === "string") return renderStringItem(item);

    // otherwise pass it on down
    return <MenuItem {...item}/>;
  }).filter(Boolean);
}

// Render an item from a single string value.
export function renderStringItem(label) {
  // if it's all dashes, make a separator
  if (/^-+$/.test(label)) return <Divider/>;

  // if it starts with "#", make a header
  if (label[0] === "#") return <MenuHeader label={label.substr(1)}/>;

  return <MenuItem label={label} value={label}/>;
}

export function renderItemsMap(itemsMap) {
  return Object.keys(itemsMap).map(value => {
    const label = itemsMap[value];
    return <MenuItem value={value} label={label}/>;
  });
}


// `appearance`:  Any space-delimited combination of:
//    - `fluid`, `compact`, `large`, `small`
//    - `text`, `icon`, `labeled icon`
//    - `tabular`, `pointing`, `attached` `top attached`, `bottom attached`
//    - `vertical`, `two item`, `three item`, etc
//    - `borderless`, `secondary`, `inverted`
//    - `stackable`, `top fixed`, `left fixed`, etc
function SUIMenu(props, context) {
  const {
    className,
    items, header, headerIcon, children,
    appearance, color, size, itemCount,
    disabled,
    // including id, style
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : {
      ...extraProps,
      className: [className, "ui", appearance, color, size, getItemCountClass(itemCount), { disabled }, "menu"]
    }
  });

  if (header) {
    const headerElement = <MenuHeader label={header} icon={headerIcon}/>;
    elements.append(headerElement);
  }
  if (items) elements.append(renderItems(items));
  if (children) elements.append(children);

  return elements.render();
}

SUIMenu.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  items: PropTypes.any,
  header: PropTypes.string,
  headerIcon: PropTypes.string,
  children: PropTypes.any,

  appearance: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  itemCount: PropTypes.number,

  disabled: PropTypes.bool,
};

// Add a render method so we get hot reload.
SUIMenu.render = Function.prototype;

export default SUIMenu;

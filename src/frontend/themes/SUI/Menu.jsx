"use strict";
//////////////////////////////
//
//  <MenuItems> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import classNames from "classnames";

import ElementBuffer from "./ElementBuffer";

import MenuItem from "./MenuItem";
import MenuHeader from "./MenuHeader";
import Divider from "./Divider";



// Render a set of items as:
//  - a delimited string list
//  - an array of `string` or `{value, label}` pairs
//  - a map of `{value:label}`.
// Returns an array of MenuItem or MenuHeaders etc.
export function renderItems({ items, itemDelimiter = "," }) {
  if (!items) return undefined;

  if (typeof items === "string")
    return renderItemsArray(items.split(itemDelimiter));

  if (Array.isArray(items))
    return renderItemsArray(items);

  return renderItemsMap(items);
}

export function renderItemsArray(items) {
  return items.map(item => {
    if (!item) return undefined;
    if (typeof item === "string") return <MenuItem label={item}/>;
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

export function renderMenuHeader({ header, headerIcon }={}) {
  if (!header) return undefined;
  return <MenuHeader label={header} icon={headerIcon}/>;
}


// `appearance`:  Any space-delimited combination of:
//    - `fluid`, `compact`, `large`, `small`
//    - `text`, `icon`, `labeled icon`
//    - `tabular`, `pointing`, `attached` `top attached`, `bottom attached`
//    - `vertical`, `two item`, `three item`, etc
//    - `borderless`, `secondary`, `inverted`, `red`, `green`, etc
//    - `stackable`, `top fixed`, `left fixed`, etc
function SUIMenu(props, context) {
  const {
    id, className, style,
    items, itemDelimiter, header, headerIcon, children,
    appearance,
    disabled,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : {
      ...extraProps,
      id,
      style,
      className: classNames(className, "ui", appearance, { disabled }, "menu")
    }
  });

  if (header) elements.append(renderHeader(props));
  if (items) elements.append(renderItems(props));
  if (children) elements.append(children);

  return elements.render();
}

SUIMenu.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  items: PropTypes.any,
  itemDelimiter: PropTypes.string,
  header: PropTypes.string,
  headerIcon: PropTypes.string,
  children: PropTypes.any,

  appearance: PropTypes.string,

  disabled: PropTypes.bool,
};

// Add a render method so we get hot reload.
SUIMenu.render = Function.prototype;

export default SUIMenu;

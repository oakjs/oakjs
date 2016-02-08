"use strict";
//////////////////////////////
//
//  <Tabbar> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { isElement, hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import { getAttachedClass } from "./constants";

// Render a set of items as:
//  - a delimited string list
//  - an array of `string` or `{value, label}` pairs
//  - a map of `{value:label}`.
// Returns an array of MenuItem or MenuHeaders etc.
export function renderTabs(tabs) {
  if (!tabs) return undefined;

  if (Array.isArray(tabs))
    return renderTabsArray(tabs);

  return renderTabsMap(tabs);
}

export function renderTabsArray(tabs) {
  return tabs.map(tab => {
    if (!tab) return undefined;

    // if we got a react element, just return it
    if (isElement(tab)) return tab;

    // If we got a string, return a simple menuItem
    if (typeof tab === "string") return renderTab({ name: tab });

    return renderTab(tab);
  }).filter(Boolean);
}

export function renderTabsMap(tabsMap) {
  return Object.keys(tabsMap).map(name => {
    const title = tabsMap[name];
    return renderTab({ name, title });
  });
}


// Render an tab from a single string value.
export function renderTab({ name, title = name, icon, active = false } = {}) {
  const elements = new ElementBuffer({
    type: "a",
    props: {
      "data-tab": name,
      className: [ { active }, "item"]
    }
  });
  if (icon) elements.appendIcon(icon);
  elements.append(title);
  return elements.render();
}


function SUITabbar(props, context) {
  const {
    className,
    tabs, extras, children,
    appearance, on,
    // including id, style
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : {
      ...extraProps,
      className: [className, "ui", appearance, getAttachedClass(on), "tabular menu"]
    }
  });

  // if we didn't get any tabs
  if (!tabs) {
    // if we got children, just use those
    if (children) {
      elements.append(children);
    }
    else {
      console.warn(this,".render(): expected props.tabs or props.children");
    }
    return elements.render();
  }

  // output tabs first
  elements.append(renderTabs(tabs));

  // if we got extras or children, render those in a right-menu
  if (extras || children) elements.appendWrapped("div", "right menu", extras, children);

  return elements.render();
}

SUITabbar.propTypes = {
  on: "top"
}

SUITabbar.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  tabs: PropTypes.any,
  extras: PropTypes.any,
  children: PropTypes.any,

  appearance: PropTypes.string,
  on: PropTypes.string,
};

// Add a render method so we get hot reload.
SUITabbar.render = Function.prototype;

export default SUITabbar;

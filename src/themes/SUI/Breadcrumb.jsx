"use strict";
//////////////////////////////
//
//  <Breadcrumb> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import ElementBuffer from "./ElementBuffer";
import Icon from "./Icon";


function normalizeItems(items) {
  if (!items) return [];

  if (Array.isArray(items)) return normalizeItemsArray(items);
  return normalizeItemMap(items);
}

function normalizeItemsArray(items) {
  return items
        .filter(Boolean)
        .map( (item, index) => {
          return (typeof item === "string" ? { title: item } : item);
        });
}

function normalizeItemMap(map) {
  return Object.keys(map)
          .map( (link, index) => {
            return { link, title: map[link] };
          });
}


function SUIBreadcrumb(props) {
  const {
    id, className, style,
    items, children,
    divider, icon,
    appearance, size, lastIsActive,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : {
      ...extraProps,
      id,
      className: [className, "ui", appearance, size, "breadcrumb"],
      style
    }
  });

  if (items) {
    const dividerElement = icon
                         ? <Icon icon={icon} appearance="divider"/>
                         : <div className="divider">{divider}</div>;

    const normalized = normalizeItems(items);
    normalized.forEach( (item, index) => {
        if (index !== 0) elements.append(dividerElement);

        let { title, link, active } = item;
        if (active === undefined) active = (lastIsActive && index === (normalized.length - 1));

        const props = {
          className: (active ? "active section" : "section"),
          href: link
        }
        const tagName = (link && !active ? "a" : "div");

        elements.append(React.createElement(tagName, props, title));
      });
  }
  else {
    elements.append(children);
  }

  return elements.render();
}

SUIBreadcrumb.defaultProps = {
  lastIsActive: true,
  divider: "/"
}

SUIBreadcrumb.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  items: PropTypes.any,
  children: PropTypes.any,

  appearance: PropTypes.string,
  size: PropTypes.string,         // "small", "medium", "large", "huge"
  divider: PropTypes.string,
  icon: PropTypes.string,
  lastIsActive: PropTypes.bool

};

// add render() method so we get hot code reload.
SUIBreadcrumb.render = Function.prototype;

export default SUIBreadcrumb;

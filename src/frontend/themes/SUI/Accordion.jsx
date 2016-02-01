"use strict";
//////////////////////////////
//
//  <Accordion> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { autobind } from "core-decorators";

import { isElement, hasClass } from "./SUI";
import ElementBuffer from "./ElementBuffer";
import SUIModuleComponent from "./SUIModuleComponent";
import Icon from "./Icon";

import "./Accordion.css";

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


// Given an array of `[ "title", "content", "title", "content", ...]`
// render items to show in an accordion.
// NOTE: returns an ARRAY of elements!
export function renderItemsArray(items) {
  const results = [];
  for (let i = 0; i < items.length; i += 2) {
    const item = renderAccordionItem(items[i], items[i+1]);
    results.push(item);
  }
  return results.filter(Boolean);
}

// Given a map of `{ title: content }`, render items to show in an accordion.
// NOTE: returns an ARRAY of elements!
export function renderItemsMap(itemsMap) {
  return Object.keys(itemsMap).map(title => renderAccordionItem(title, itemsMap[title]));
}

// Render an accordion item given `title` and `context` strings.
// NOTE: returns an ARRAY of elements!
function renderAccordionItem(title, content) {
  return [
    renderAccordionTitle(title),
    renderAccordionContent(content)
  ];
}

function renderAccordionTitle(title) {
  // if we got a ".title" element, just return that
  if (isElement(title) && hasClass(title, "title")) return title;
  // otherwise return title wrapped appropriately
  return <div className="title"><Icon icon="dropdown"/>{title}</div>;
}

function renderAccordionContent(content) {
  // if we got a "content" element, just return that
  if (isElement(content) && hasClass(content, "content")) return content;

  // If we got a string, split into paragraphs and wrap
  if (typeof content === "string") {
    const paragraphs = content.split("\n\n").map( paragraph => <p>{paragraph}</p> );
    return React.createElement("div", { className: "content" }, ...paragraphs);
  }
  // otherwise return content wrapped appropriately
  return <div className="content">{content}</div>;
}


// `appearance`:  Any space-delimited combination of:
//    - `fluid`, `compact`, `large`, `small`
//    - `text`, `icon`, `labeled icon`
//    - `tabular`, `pointing`, `attached` `top attached`, `bottom attached`
//    - `vertical`, `two item`, `three item`, etc
//    - `borderless`, `secondary`, `inverted`
//    - `stackable`, `top fixed`, `left fixed`, etc
class SUIAccordion extends SUIModuleComponent {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    items: PropTypes.any,
    children: PropTypes.any,

    appearance: PropTypes.string,

    exclusive: PropTypes.bool,
    on: PropTypes.string,
    animateChildren: PropTypes.bool,
    closeNested: PropTypes.bool,
    collapsible: PropTypes.bool,

    open: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number)
    ])
  };

  //////////////////////////////
  // Component lifecycle
  //////////////////////////////

  componentDidMount() {
    super.componentDidMount();

    this.open(...this.normalizeOpen());
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(...arguments);

    const current = this.normalizeOpen();
    const prev = this.normalizeOpen(prevProps.open);

    // close everything that's in the previous list that's not in the current list
    const inPrevOnly = prev.filter( index => !current.includes(index) );
    this.close(...inPrevOnly);

    // open everything that's in the current list that's not in the previous list
    const inCurrentOnly = current.filter( index => !prev.includes(index) );
    this.open(...inCurrentOnly);
  }

  //////////////////////////////
  // SUI Accordion Module Properties
  //////////////////////////////

  static moduleProps = {
    exclusive: true,
    on: true,
    animateChildren: true,
    closeNested: true,
    collapsible: true,
    onOpening: true,
    onOpen: true,
    onClosing: true,
    onClose: true,
    onChange: true,
  }

  tellModule(...args) {
    this.$ref().accordion(...args);
  }

  normalizeOpen(open = this.props.open) {
    if (typeof open === "number") return [open];
    if (Array.isArray(open)) return open.filter( item => typeof item === "number");
    return [];
  }

  //////////////////////////////
  // SUI Accordion Module Behaviors
  //////////////////////////////

  toggle(...indexes) {
    indexes.forEach( index => this.tellModule("toggle", index) );
  }

  open(...indexes) {
    indexes.forEach( index => this.tellModule("open", index) );
  }

  close(...indexes) {
    indexes.forEach( index => this.tellModule("close", index) );
  }

  closeOthers() {
    this.tellModule("close others")
  }

  refresh() {
    this.tellModule("refresh")
  }


  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      // content
      items, children,
      // appearance
      className, appearance,
      // functionality
      exclusive, on, animateChildren, closeNested, collapsible,
      // event handling
      onOpening, onOpen, onClosing, onClose, onChange,
      // visible
      selectedIndex,
      // everything else including id, style
      ...extraProps
    } = this.props;

    const elements = new ElementBuffer({
      props : {
        ...extraProps,
        className: [className, "ui", appearance, "accordion"]
      }
    });

    if (items) elements.append(renderItems(items));
    if (children) elements.append(children);

    return elements.render();
  }
}

export default SUIAccordion;

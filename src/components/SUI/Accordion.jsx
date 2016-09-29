"use strict";
//////////////////////////////
//
//  <Accordion> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import { isElement, hasClass, unknownProperties } from "./SUI";
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
export function renderAccordionItem(title, content) {
  return [
    renderAccordionTitle(title),
    renderAccordionContent(content)
  ];
}

export function renderAccordionTitle(title) {
  // if we got a ".title" element, just return that
  if (isElement(title) && hasClass(title, "title")) return title;
  // otherwise return title wrapped appropriately
  return <div className="title"><Icon icon="dropdown"/>{title}</div>;
}

export function renderAccordionContent(content) {
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


const moduleProps = {
  exclusive: PropTypes.bool,          // "Only allow one section open at a time."
  on: PropTypes.string,               // "Event on title that will cause accordion to open"
  animateChildren: PropTypes.bool,    // "Whether child content opacity should be animated
                                      //  (may cause performance issues with many child elements)"
  closeNested: PropTypes.bool,        // "Close open nested accordion content when an element closes"
  collapsible: PropTypes.bool,        // "Allow active sections to collapse"
  duration: PropTypes.number,         // "Duration in ms of opening animation"
  easing: PropTypes.any,              // "Easing of opening animation."

  onOpening: PropTypes.func,          // "Callback before element opens"
  onOpen: PropTypes.func,             // "Callback after element is open"
  onClosing: PropTypes.func,          // "Callback before element closes"
  onClose: PropTypes.func,            // "Callback after element is closed"
  onChange: PropTypes.func,           // "Callback on element open or close"
}

class SUIAccordion extends SUIModuleComponent {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,

    // {title:content} map, array of <Title>,<Content> elements, or string array of ["Title", "Content", "Title"...]
    items: PropTypes.any,
    children: PropTypes.any,

    appearance: PropTypes.string,

    // Indexes of items to open
    open: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number)
    ]),

    ...moduleProps
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

  static moduleProps = moduleProps;

  tellModule(...args) {
    return this.$ref().accordion(...args);
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
    return this.tellModule("close others")
  }

  refresh() {
    return this.tellModule("refresh")
  }


  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    const {
      id, className, style,
      // content
      items, children,
      // appearance
      appearance,
    } = this.props;

    const extraProps = unknownProperties(this.props, this.constructor.propTypes);

    const elements = new ElementBuffer({
      props : {
        ...extraProps,
        id,
        style,
        className: [className, "ui", appearance, "accordion"]
      }
    });

    if (items) elements.append(renderItems(items));
    if (children) elements.append(children);

    return elements.render();
  }
}

export default SUIAccordion;

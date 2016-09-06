"use strict";
//////////////////////////////
//
//  <Table> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import ElementBuffer from "./ElementBuffer";
import { isElement } from "./SUI";
import { getColumnCountClass } from "./constants";


export function renderTableHeader({ header, appearance, tagName="thead" }) {
  // if we got an instance of the specified, tag just return that
  if (isElement(header, tagName)) return header;

  let row
  // if we got a tr, wrap it and return
  if (isElement(header, "tr")) {
    row = header;
  }
  // if we got an array, render as a row of cells
  else if (Array.isArray(header)) {
    row = renderTableRow({ cells: header, cellTagName: "th" });
  }
  else {
    console.warn("SUITable.renderTableHeader(): don't know how to process header: ", header);
    return undefined;
  }

  return React.createElement(tagName, { className: appearance }, row);
}

export function renderTableRow({ cells, rowAppearance, cellAppearance, cellTagName="td"}) {
  // if we got a tr element, simply return it.
  if (isElement(cells, "tr")) return cells;

  if (!Array.isArray(cells)) throw new TypeError("SUITable.renderTableRow(): we can only process arrays.");

  const cellElements = cells.map( cellValue => {
    // if we got a target element, just return it
    if (isElement(cellValue, cellTagName)) return cellValue;

    return React.createElement(cellTagName, { className: cellAppearance }, cellValue);
  });

  return React.createElement("tr", { className: rowAppearance }, ...cellElements);
}


function SUITable(props) {
  const {
    body, children,
    header, headerAppearance, footer, footerAppearance,
    appearance, size, color, sorting, columns,
    // includes id, className, style,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    type: "table",
    props: extraProps
  })
  elements.addClass("ui", appearance, size, color, getColumnCountClass(columns), { sorting }, "table");

  // add header if defined
  if (header) elements.append( renderTableHeader({header, appearance: headerAppearance, tagName: "thead"}) );

  // add children
  if (children) {
    elements.append(children);
  }
  else if (body) {
    if (isElement(body)) {
      elements.append(body);
    } else {
      // Assume data is an array of arrays of strings
      if (!Array.isArray(body)) throw new TypeError("SUITable.render(): we can only handle `body` as elements or arrays.");
      const rows = body.filter(Boolean).map( cells => {
        return renderTableRow({ cells });
      });
      elements.appendWrapped("tbody", undefined, rows);
    }
  }

  // add footer if defined
  if (footer) elements.append( renderTableHeader({ header: footer, appearance: footerAppearance, tagName: "tfoot"}) );

  return elements.render();
}

SUITable.defaultProps = {
  headerAppearance: "dividing"
}

SUITable.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  header: PropTypes.any,
  headerAppearance: PropTypes.string,

  footer: PropTypes.any,
  footerAppearance: PropTypes.string,

  body: PropTypes.any,
  children: PropTypes.any,

  appearance: PropTypes.string,   // "collapsed", "threaded", "minimal"
  color: PropTypes.string,
  size: PropTypes.string,         // "small", "medium", "large"
  sorting: PropTypes.bool,
  columns: PropTypes.number,
};

// add render() method so we get hot code reload.
SUITable.render = Function.prototype;

export default SUITable;

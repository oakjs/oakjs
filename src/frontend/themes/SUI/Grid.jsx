"use strict"
/* eslint-disable quote-props */

//////////////////////////////
//
//   <Grid> component using SemanticUI's 16-grid setup
//
//////////////////////////////

import React, { PropTypes } from "react";
import SUIComponent from "./SUIComponent";

export default class SUIGrid extends SUIComponent {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element),
  };

  static getColumnWidthClass(width) {
    if (width) {
      const name = this.columnNames[width];
      if (name) return `${name} width column`;
      console.warn(`Don't understand column width ${width}.`);
    }
  }

  static columnNames = {
    "0":   "zero",
    "1":   "one",
    "2":   "two",
    "3":   "three",
    "4":   "four",
    "5":   "five",
    "6":   "six",
    "7":   "seven",
    "8":   "eight",
    "9":   "nine",
    "10":  "ten",
    "11":  "eleven",
    "12":  "twelve",
    "13":  "thirteen",
    "14":  "fourteen",
    "15":  "fifteen",
    "16":  "sixteen",
    all:   "sixteen"
  };


  // Use this to render a grid statically from some other class.
  static renderGrid(children) {
    return <div className="ui grid">{children}</div>;
  }

  render() {
    return Grid.renderGrid(this.props.children);
  }

}

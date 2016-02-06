"use strict";
//////////////////////////////
//
//	Constants for use with SUI
//
//////////////////////////////

import classNames from "classnames";

import SUI from "./SUI";


//////////////////////////////
//  Columns / etc which use names for numbers
//////////////////////////////

export const NAMES_FOR_NUMBERS = [
  undefined,
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
];

export function getNameForNumber(number) {
  return NAMES_FOR_NUMBERS[number];
}

// Used by Grid to specify the number of columns in the grid.
export function getColumnCountClass(columns) {
  if (!columns) return undefined;
  const name = getNameForNumber(columns);
  if (name) return name + " column";
}

// Used by Columns etc to specify # of grid columns this element should take up
export function getColumnWidthClass(columns) {
  if (!columns) return undefined;
  const name = getNameForNumber(columns);
  if (name) return name + " wide";
}

// Used by Menus etc to specify # of items in a menu (for fixed width)
export function getItemCountClass(items) {
  if (!items) return undefined;
  const name = getNameForNumber(items);
  if (name) return name + " item";
}


//////////////////////////////
//  Floated (left|right)
//////////////////////////////

export const FLOATED_CLASSES = {
  right: "right floated",
  left: "left floated"
}
export function getFloatedClass(floated) {
  return FLOATED_CLASSES[floated];
}

//////////////////////////////
//  Alignment classes
//////////////////////////////

export const ALIGN_CLASSES = {
  right: "right aligned",
  center: "center aligned",
  left: "left aligned",
  justified: "justified",
  top: "top aligned",
  middle: "middle aligned",
  bottom: "bottom aligned",
}
export function getAlignClass(align) {
  if (!align) return undefined;
  return align.trim().split(/\s+/)
    .map( align => ALIGN_CLASSES[align] )
    .filter(Boolean)
    .join(" ");
}



//////////////////////////////
//  HEADER_SIZE
//////////////////////////////

export const HEADER_SIZE_CLASSES = {
  "huge": "h1",
  "large": "h2",
  "medium": "h3",
  "small": "h4",
  "tiny": "h5",
}
export function getHeaderClass(size) {
  return HEADER_SIZE_CLASSES[size] || HEADER_SIZE_CLASSES.medium;
}


//////////////////////////////
//  ATTACHMENT
//////////////////////////////

export const ATTACHED_CLASSES = {
  "top": "top attached",
  "bottom": "bottom attached",
  "left": "left attached",
  "right": "right attached",
}
export function getAttachedClass(attached) {
  return ATTACHED_CLASSES[attached];
}

export function getOppositeAttachedClass(attached) {
  if (attached === "top") return ATTACHED_CLASSES.bottom;
  if (attached === "bottom") return ATTACHED_CLASSES.top;
  if (attached === "left") return ATTACHED_CLASSES.right;
  if (attached === "right") return ATTACHED_CLASSES.left;
}


//////////////////////////////
//  POINTING
//////////////////////////////

export const POINTING_CLASSES = {
  [true]: "pointing",
  above: "pointing",
  below: "pointing below",
  right: "right pointing",
  left: "left pointing",
  up: "pointing",
  down: "pointing below"
}

export function getPointingClass(pointing) {
  return POINTING_CLASSES[pointing]
}

//////////////////////////////
//  Spaced (Images)
//////////////////////////////

export function getSpacedClass(spaced) {
  if (spaced === true) return "spaced";
  if (typeof spaced === "string") return `${spaced} spaced`;
  return undefined;
}


//////////////////////////////
//  Special action button names mapped to action classes (Modal)
//////////////////////////////

export const ACTION_CLASSES = {
  ok: "approve",
  save: "approve",
  cancel: "cancel"
}

export function getActionClass(actionTitle) {
  if (typeof actionTitle === "string") return ACTION_CLASSES[actionTitle.toLowerCase()];
}


// Assign all constants to SUI
Object.assign(SUI, exports);

export default SUI;

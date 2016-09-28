"use strict";
//////////////////////////////
//
//  Constants for use with oak
// DEPRECATED!!!
//
//////////////////////////////

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


// Export all as a map.
export default {...exports};

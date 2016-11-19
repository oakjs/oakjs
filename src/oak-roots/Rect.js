//////////////////////////////
//
//  `Rect` class for geometry manipulation.
//
//  NOTE: if you pass a `NaN` value on construction, it will be silently converted to `0`.
//
//////////////////////////////

import Point from "./Point";

export default class Rect {
  // Initialize with `left`, `top`, `width`, `height`
  constructor(left, top, width, height) {
    this.left = left || 0;
    this.top = top || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  // Return a clone of this rect.
  // You can optionally pass a map of `props` and we'll set the new rect as in `set()`.
  clone(props) {
    const rect = new Rect(this.left, this.top, this.width, this.height);
    if (props) rect.set(props);
    return rect;
  }

  // Update this rect IN PLACE with props as any of:
  //  `{ left, top, width, height, right, bottom }`.
  //
  // NOTE: order is important:
  //  - set `left` first before setting `right`, if you want to change the `width`
  //  - set `right` first before setting `width`, if you want to change the `left`
  set(props) {
    for (let key in props) {
      let value = props[key];
      if (typeof value !== "number" || isNaN(value)) {
        console.warn("\tRect.js -> set(props) received invalid argument: '" + value + "' , --> for key: " + key);
        continue;
      }
      switch(key) {
        case "left": this.left = value; break;
        case "top": this.top = value; break;
        case "width": this.width = value; break;
        case "height": this.height = value; break;
        case "right": this.width = value - this.left; break;
        case "bottom": this.height = value - this.top; break;
      }
    }
    return this;
  }

  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////

  get topLeft() {
    return new Point(this.left, this.top);
  }

  get right() {
    return this.left + this.width;
  }

  get bottom() {
    return this.top + this.height;
  }

  get isEmpty() {
    return this.width === 0 && this.height === 0;
  }

  // Return as a CSS compatible object
  get style() {
    return {
      left: this.left + "px",
      top: this.top + "px",
      width: this.width + "px",
      height: this.height + "px",
    }
  }

  // Return as a CSS-compatible string.
  get styleString() {
    return `left: ${this.left}px; `
         + `top: ${this.top}px; `
         + `width: ${this.width}px; `
         + `height: ${this.height}px;`
  }

  get size() {
    return { width: this.width, height: this.height }
  }

  //////////////////////////////
  //  Math-y stuff
  //////////////////////////////

  equals(rect) {
    if (!rect) return false;
    return this.left === rect.left
        && this.top === rect.top
        && this.width === rect.width
        && this.height === rect.height;
  }

  // Return a NEW `Rect` converted to integers.
  integerize() {
    return new Rect(
      Math.floor(this.left),
      Math.floor(this.top),
      Math.ceil(this.width),
      Math.ceil(this.height)
    );
  }

  // Returns `true` if this rect contains point at `x`, `y`.
  containsPoint(point) {
    return this.contains(point.x, point.y);
  }

  // Returns `true` if this rect contains point at `x`, `y`.
  contains(x, y) {
    return x >= this.left
        && x <= this.right
        && y >= this.top
        && y <= this.bottom;
  }

  // Returns `true` if this rect intersects the other `rect`.
  intersects(rect) {
    if (!rect) return false;
    return (this.right >= rect.left)
        && (rect.right >= this.left)
        && (this.bottom >= rect.top)
        && (rect.bottom >= this.top);
  }

  // Offset this rect by some `point`.
  offset(point) {
    return Rect.offset(this, point);
  }

  // Return a new rect inset a rect by a certain `delta` on all sides.
  inset(delta = 0) {
    return new Rect(
      this.left + delta,
      this.top + delta,
      this.width - (delta*2),
      this.height - (delta*2)
    );
  }

  // Return a new rect outset a rect by a certain `delta` on all sides.
  outset(delta = 0) {
    return this.inset(-delta);
  }

  //////////////////////////////
  //  Static math-y functions
  //////////////////////////////

  // Return the smallest `Rect` which contains all `rects` passed in.
  // If `rects` is empty returns `undefined`.
//TODO: return `undefined` if no rects???
  static containingRect(rects) {
    if (!rects || !rects.length) return undefined;

    // If only one thing, just clone it.
    if (rects.length === 1) return rects[0].clone();

    let { left, top, right, bottom } = rects[0];
    rects.forEach( (rect, index) => {
      if (index === 0) return;
      if (rect.left < left)     left = rect.left;
      if (rect.top  < top)      top = rect.top;
      if (rect.right > right)   right = rect.right;
      if (rect.bottom > bottom) bottom = rect.bottom;
    });

    return new Rect(left, top, right-left, bottom-top);
  }

  // Given two points, return the rectangle as top-left and bottom-right.
  // Returns `undefined` if either point is `null`.
  static rectFromPoints(point1, point2) {
    if (!point1 || !point2) return undefined;

    const left = Math.min(point1.x, point2.x);
    const right = Math.max(point1.x, point2.x);
    const top = Math.min(point1.y, point2.y);
    const bottom = Math.max(point1.y, point2.y);
    return new Rect(left, top, right-left, bottom-top);
  }

  // Offset a rect by some `point`.
  static offset(rect, point) {
    return new Rect(rect.left + point.x, rect.top + point.y, rect.width, rect.height);
  }

  //////////////////////////////
  //  Validate
  //////////////////////////////

  static isRectLike(rect) {

    if (rect instanceof Rect) return true;

    return !!rect
      && typeof rect.left === 'number'
      && !isNaN(rect.left)
      && typeof rect.top === 'number'
      && !isNaN(rect.top)
      && typeof rect.width === 'number'
      && !isNaN(rect.width)
      && typeof rect.height === 'number'
      && !isNaN(rect.height);
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////

  toString() {
    return `{l:${this.left}, t:${this.top}, w:${this.width}, h:${this.height}}`;
  }

}

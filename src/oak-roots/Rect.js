//////////////////////////////
//
//  `Rect` class for geometry manipulation.
//
//  NOTE: if you pass a `NaN` value on construction, it will be silently converted to `0`.
//
//////////////////////////////

export default class Rect {
  // Initialize with `left`, `top`, `width`, `height`
  constructor(left, top, width, height) {
    this.left = left || 0;
    this.top = top || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  clone() {
    return new Rect(this.left, this.top, this.width, this.height);
  }

  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////
  get right() {
    return this.left + this.width;
  }

  get bottom() {
    return this.top + this.height;
  }

  get isEmpty() {
    return this.width === 0 && this.height === 0;
  }

  //////////////////////////////
  //  Math-y stuff
  //////////////////////////////

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
        && (this.bottom >= rect.bottom)
        && (rect.bottom >= this.bottom);
  }

  //////////////////////////////
  //  Static math-y functions
  //////////////////////////////

  // Return the smallest `Rect` which contains all `rects` passed in.
  // If `rects` is empty returns a 0-size rect.
  static containingRect(rects) {
    if (!rects || !rects.length) return new Rect();
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
  static rectFromPoints(point1, point2) {
    if (!point1 || !point2) return undefined;

    const left = Math.min(point1.x, point2.x);
    const right = Math.max(point1.x, point2.x);
    const top = Math.min(point1.y, point2.y);
    const bottom = Math.max(point1.y, point2.y);
    return new Rect(left, top, right-left, bottom-top);
  }

}

//////////////////////////////
//
//  `Rect` class for geometry manipulation.
//
//  NOTE: if you pass a `NaN` value on construction, it will be silently converted to `0`.
//  TODO: consider adding a units parameter for xy location, (vs pixel). rms and ems
//////////////////////////////


export default class Point {
  // Initialize with `x`, `y`
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  //////////////////////////////
  // Syntactic sugar
  //////////////////////////////

  get left() {
    return this.x;
  }

  get top() {
    return this.y;
  }

  // Is this point at the origin (0,0) ?
  get isOrigin() {
    return this.x === 0 && this.y === 0;
  }

  // Return this point as a `{ top, left }`, eg for use as CSS `style` values.
  get style() {
    return { left: this.x, top: this.y };
  }

  // Size of this point if treated as a vector.
  get size() {
    return Math.max(Math.abs(this.x), Math.abs(this.y));
  }

  //////////////////////////////
  //  Math-y stuff
  //////////////////////////////

  // Return a NEW `Point` converted to integers.
  integerize() {
    return new Point(
      Math.floor(this.x),
      Math.floor(this.y)
    );
  }

  // Return the inverse of this point
  invert() {
    return new Point(-this.x, -this.y);
  }

  // Return true if coordinates match
  equals(point) {
    if (!Point.isPointLike(point)) return false;
    return this.x === point.x && this.y === point.y;
  }

  // Delta between this point and another point as a new Point.
  delta(point) {
    return this.subtract(point);
  }

  // Add another point to us.
  add(point) {
    if (!Point.isPointLike(point)) return undefined;
    return new Point(this.x + point.x, this.y + point.y);
  }

  // Subtract another point from us.
  subtract(point) {
    if (!Point.isPointLike(point)) return undefined;
    return new Point(this.x - point.x, this.y - point.y);
  }

  //////////////////////////////
  //  Validate point & point-like objects
  //////////////////////////////
  static isPointLike(thing) {

    // RETURNS true if exactly what we want
    if (thing instanceof Point) return true;

    //////////////////////
    // RETURNS true if its kinda-like what we want, that is:
    //    has properties x,y oftype 'number' but not NaN numbers
    // RETURNS false if thing is neither a point nor point-like,
    //    or is empty string, undefined, NaN, null
    return !!thing
      && typeof thing.x === "number"
      && !isNaN(thing.x)
      && typeof thing.y === "number"
      && !isNaN(thing.y);
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////

  toString() {
    return `${this.x},${this.y}`;
  }
}

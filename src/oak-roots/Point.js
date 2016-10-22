//////////////////////////////
//
//  `Rect` class for geometry manipulation.
//
//  NOTE: if you pass a `NaN` value on construction, it will be silently converted to `0`.
//
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

  //////////////////////////////
  //  Math-y stuff
  //////////////////////////////



  // return false if no arguments are passed
  // return false if pointlike AND coordinates do not match
  // return true if pointlike AND coordinates match
  equals(point) {

    // return false if nobody home
    if (arguments.length === 0){
      return false;
    }

    // return true if:
    //1. you pass the isPointLike validator
    //2. AND your coordinates match
    if (Point.isPointLike(point)) {
      return this.x === point.x
          && this.y === point.y;
      }

    else {
      return false;
    }
  }


  // Return a NEW `Point` converted to integers.
  integerize() {
    return new Point(
      Math.floor(this.x),
      Math.floor(this.y)
    );
  }

  // Delta between this point and another point as a new Point.
  delta(point) {
    return Point.delta(this, point);
  }

  // Add another point to us.
  add(point) {
    return Point.add(this, point);
  }

  // Subtract another point from us.
  subtract(point) {
    return Point.subtract(this, point);
  }

  // Return the inverse of this point
  invert() {
    return Point.invert(this);
  }

  // Size of this point if treated as a vector.
  get size() {
    return Math.max( Math.abs(this.x), Math.abs(this.y) );
  }

  //////////////////////////////
  //  Static Math-y stuff
  //////////////////////////////

  // Return a new point which represents the delta between two points.
  static delta(point1 = new Point(), point2 = new Point()) {
    return new Point(point1.x - point2.x, point1.y - point2.y);
  }

  // Return a new point which adds the two points together.
  static add(point1 = new Point(), point2 = new Point()) {
    return new Point(point1.x + point2.x, point1.y + point2.y);
  }

  // Return a new point which subtracts the second point from the first.
  static subtract(point1 = new Point(), point2 = new Point()) {
    return new Point(point1.x - point2.x, point1.y - point2.y);
  }

  // Return the inverse of this point
  static invert(point = new Point()) {
    return new Point( -point.x, -point.y);
  }

  //////////////////////////////
  //  Validate
  //////////////////////////////
  //TODO: apply feedback from code review
  // Figure out exception case first, then bail.
  // What's the anomolous input?
  //if argument is null, return false".
  // Return true if the thing looks, tastes, and acts like a point
  static isPointLike(thing) {
    // if a thing is not a thing, then get lost
    if (!thing) {
      return false;
    }

    /*
    // return false if nobody's home
    if (arguments.length === 0){
      return false;
    }

    // return false if you're something undefined, return false
    // previously isPointLike caused an error when passed an undefined object
    if (typeof thing === 'undefined'){
      return false;
    }
    */

    // hey, if a thing exists AND if the thing is a point, then we're good
    if (arguments.length === 1 && arguments[0] instanceof Point) {
    //if (thing instanceof Point) {
      return true;
    }

    // hey thing-that's-not-a-point, are you point-like with valid xy?
    else if (((typeof thing.x === 'number' )  // let all numbers pass (including NaN)
          && (typeof thing.y === 'number' ))
          && ((thing.x === thing.x)           // filter out NaN numbers
          && (thing.y === thing.y))){
      return true;
    }
    // sorry thing
    else {
      return false;
    }
  }

  //////////////////////////////
  //  Debug
  //////////////////////////////

  toString() {
    return `${this.x},${this.y}`;
  }
}

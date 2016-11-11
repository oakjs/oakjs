/* eslint-env node, mocha */
import "babel-core/external-helpers";

let chai  = require('chai');

chai.should();
chai.expect();

import Rect from '../src/oak-roots/Rect';

describe('Rect', () => {

  /*
  test_constructor();

  test_clone();
  test_set();

  // syntatic sugar
  test_topLeft();
  test_right();
  test_bottom();
  test_isEmpty();
  test_style();
  test_styleString();
  test_size();

  // math-y stuff
  test_equals();
  test_integerize();
  test_containsPoint();
  test_contains();
  test_intersects();
  test_offset();
  test_inset();
  test_outset();

  // static
  test_static_containingRect();
  test_static_rectFromPoints();
  test_static_offset();

  // debug
  test_toString();
*/
  // validate
  test_isRectLike();
});


function test_isRectLike () {
  let testTypeStr,
      testTypeBool,
      testTypeFun,
      testTypeSym,
      testTypeNum,
      testTypeNumIsNaN,
      testTypeObjIsNull,
      rect,
      rect1,
      rect2,
      rectThingObject,
      rectThingOneObject,
      rectThingOtherObject,
      rectThing,
      rectThingString,
      rectThingOneString,
      rectThingOtherString,
      rectThingNaN,
      rectThingOneNaN,
      rectThingOtherNaN,
      rectThingUndefined,
      rectThingOneUndefined,
      rectThingOtherUndefined,
      x,
      y;

  beforeEach(() => {
    rect = new Rect(0,0,100,50);
  });

  describe('\n--------\n#isRectLike\n', () => {

    describe('TEST RECT.test -- returns true if ...', () => {

      it('if given anything', () => {
        testTypeNum = 1;
        (Rect.isRectLike(testTypeNum)).should.equal(true);
        (1).should.equal(1);
      });
    });

/*
    describe('returns false if given...', () => {

      it('no argument', () => {
        (Point.isPointLike()).should.equal(false);
      });

      it('no argument', () => {
        (Point.isPointLike()).should.equal(false);
      });

      it('an undefined argument\n', () => {
        let boom;
        (Point.isPointLike(boom)).should.equal(false);
      });
    });

    describe('returns true if given...', () => {
      it('an instance of Point class\n', () => {
        point = new Point(100, 150);
        (Point.isPointLike(point)).should.equal(true);
      });
    });

    describe('returns true if given...', () => {
      it('a Point-like object with valid x AND y coordinates\n', () => {
        pointThing = { x: 5, y: 500 };
        (Point.isPointLike(pointThing)).should.equal(true);
      });
    });

    describe('returns false if passed an argument of type...', () => {

      it('string', () => {
        testTypeStr = 'testArgumentAsString';
        (Point.isPointLike(testTypeStr)).should.equal(false);
      });

      it('boolean', () => {
        testTypeBool = true;
        (Point.isPointLike(testTypeBool)).should.equal(false);
      });

      it('function', () => {
        testTypeFun = function(){};
        (Point.isPointLike(testTypeFun)).should.equal(false);
      });

      it('number', () => {
        testTypeNum = 10;
        (Point.isPointLike(testTypeNum)).should.equal(false);
      });

      it('number is NaN', () => {
        testTypeNumIsNaN = NaN;
        (Point.isPointLike(testTypeNum)).should.equal(false);
      });

      it('Object is NULL\n', () => {
        testTypeObjIsNull = null;
        (Point.isPointLike(testTypeObjIsNull)).should.equal(false);
      });

    });

    describe('returns false if given a Point-like object with...', () => {

      it('strings for both x AND y coordinates', () => {
        pointThingString = { x: 'timeX', y: 'forY' };
        (Point.isPointLike(pointThingString)).should.equal(false);
      });

      it('strings for either x OR y coordinates', () => {
        pointThingOneString = { x: 'timeXOnly', y: 10 };
        (Point.isPointLike(pointThingOneString)).should.equal(false);
        pointThingOtherString = { x: 10, y: 'forYOnly' };
        (Point.isPointLike(pointThingOtherString)).should.equal(false);
      });

      it('NaN for the x coordinate', () => {
        pointThingNaN = { x: NaN, y: 21 };
        (Point.isPointLike(pointThingNaN)).should.equal(false);
      });

      it('NaN for the y coordinate', () => {
        pointThingNaN = { x: 21, y: NaN };
        (Point.isPointLike(pointThingNaN)).should.equal(false);
      });

      it('NaN for both x AND y coordinates', () => {
        pointThingNaN = { x: NaN, y: NaN };
        (Point.isPointLike(pointThingNaN)).should.equal(false);
      });

      it('NaN for either x OR y coordinates', () => {
        pointThingOneNaN = { x: NaN, y: 200 };
        (Point.isPointLike(pointThingOneNaN)).should.equal(false);
        pointThingOtherNaN = { x: 127, y: NaN };
        (Point.isPointLike(pointThingOtherNaN)).should.equal(false);
      });

      it('Undefined for the x coordinate', () => {
        pointThingOneUndefined = { x: undefined, y: 301 };
        (Point.isPointLike(pointThingOneUndefined)).should.equal(false);
      });

      it('Undefined for the y coordinates', () => {
        pointThingOtherUndefined = { x: 287, y: undefined };
        (Point.isPointLike(pointThingOtherUndefined)).should.equal(false);
      });

      it('Undefined for both x AND y coordinates', () => {
        pointThingUndefined = { x: undefined, y: undefined };
        (Point.isPointLike(pointThingUndefined)).should.equal(false);
      });

      it('Undefined for either x OR y coordinates', () => {
        pointThingOneUndefined = { x: undefined, y: 301 };
        (Point.isPointLike(pointThingOneUndefined)).should.equal(false);
        pointThingOtherUndefined = { x: 287, y: undefined };
        (Point.isPointLike(pointThingOtherUndefined)).should.equal(false);
      });

      it('point objects for both x AND y coordinates', () => {
        point1 = new Point(99, 79);
        point2 = new Point(79, 99);
        pointThingObject = { x: point1, y: point2 };
        (Point.isPointLike(pointThingObject)).should.equal(false);
      });

      it('point objects for either x OR y coordinates\n', () => {
        point1 = new Point(99, 79);
        point2 = new Point(79, 99);
        pointThingOneObject = { x: point1, y: 10 };
        (Point.isPointLike(pointThingOneObject)).should.equal(false);
        pointThingOtherObject = { x: 45, y: point2 };
        (Point.isPointLike(pointThingOtherObject)).should.equal(false);
      });
    });
*/
  });
}

/*
function test_integerize () {
  describe('#integerize', () => {
    // max and mins for cordinate system

    beforeEach(() => {

    });

    it(" ", () => {

    });

    it(" ", () => {

    });
  });
}

function test_constructor () {
  describe('#constructor()', () => {
    it('executes with two numerical arguments', () => {
        let point = new Point(30,40);
        chai.expect(point.left);
      });
    it('executes when either argument is NaN', () => {
        let point = new Point(NaN,40);
        chai.expect(point.left);
      });
    it('executes when invoked with neither x nor y parameter', () => {
        let point = new Point();
        (point.left).should.equal(0);
      });
    });
}

function test_clone () {
  describe('#clone', () => {
    // max and mins for cordinate system
   let MAX_X = 200,
       MIN_X = 200,  // absolute value
       MAX_Y = 200,
       MIN_Y = 200,  // absolute value
       point,
       clonedPoint,
       cordinate = [];

    beforeEach(() => {
      cordinate = [(Math.random()*MAX_X*2)-MIN_X, (Math.random()*MAX_Y*2)-MIN_Y];
      point = new Point(cordinate[0],cordinate[1]);
      //point = new Point(100,200);
      clonedPoint = point.clone();
    });

    it('returns a new Point object', () => {
      (typeof clonedPoint).should.equal('object');
    });

    it('creates new object at same x,y location', () => {
      (point.left).should.equal(clonedPoint.left);
      (clonedPoint.top).should.equal(cordinate[1]);
    });
  });
}

function test_right () {
  describe('#right', () => {
    let point;

    beforeEach(() => {
      point = new Point(10,20);
    });

    it('returns the x-cordinate', () => {

    });

    it('can not be changed', () => {
      (() => {point.left = 1000}).should.throw(Error);
    });
  });
}

function test_topLeft () {
  describe('#topLeft', () => {


    beforeEach(() => {

    });

    it('returns the y-cordinate', () => {

    });

    // this is how you call a function as part of the verification
    it('can not be changed', () => {
      (() => {point.top = 1000}).should.throw(Error);
    });
  });
}

function test_equals () {
  describe('#equals', () => {

    beforeEach(() => {

    });

    // test correct inputs
    it("returns true when point1 and this.point share the same xy coordinates  ", () => {

    });

    it("returns false when point1's and this.point's xy coordinates do NOT match ", () => {

    });

    // test malformed inputs
    it("returns false when no input is given ", () => {

    });

    it("returns false when passing a NaN ", () => {

    });

    it("returns false when passing a string ", () => {

    });

    it("returns false when passing a number", () => {

    });

  });
}

function test_toString () {
  describe('\n#toString', () => {
    let point;
    let cordinateString;

    beforeEach(() => {
      point = new Point(50, 100);
      cordinateString = point.toString();
    });

    it('converts cordinates as strings.', () => {
      (cordinateString).should.be.a('string');
    });

    it("returns string equivelant of Point's x,y cordinates.", () =>  {
      (cordinateString).should.equal('50,100');
    });
  });
}
*/


/*
// test suite template
function test_foo () {
  describe('#style', () => {
    let bar,
        baz;

    beforeEach(() =>  {
      bar = new Thing(50,100);
      baz = bar.getsomething;
    });

    it("returns a foo thing", () => {
      (foo.left).should.equal(50);
      (point1Style).should.have.all.keys('left', 'top');
    });

    it("returns does something else", () => {
      (point2Style.left).should.equal(-500);
      (point2Style.top).should.equal(-700);
    });
  });
}
*/

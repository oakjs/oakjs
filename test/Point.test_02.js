import "babel-core/external-helpers";
let chai  = require('chai');

chai.should();
chai.expect();

 // max and mins for cordinate system
let MAX_X = 200,
    MIN_X = 200,  // absolute value
    MAX_Y = 200,
    MIN_Y = 200;  // absolute value

import Point from '../src/oak-roots/Point';

describe('Point', () => {

  testConstructor();
  test_clone();
  test_left();
  test_top();
  test_isOrigin();

  //test_style();
  test_equals();

  //test_integerize();
  test_delta();

  test_add();

  //test_subtract();
  /*
  test_invert();
  test_size();
  test_toString();
  */

  test_isPointLike();
});

function test_add () {
  describe('#add', () => {
    let point1;
    let point2;
    let point3;
    let pointNull;

    beforeEach(() => {
      point1 = new Point (30,40);
      point2 = new Point (60,80);
      point3 = point1.add(point2);
      pointNull = point1.add(null);
    });

    it('returns undefined when passed an object that is null', () => {
      (typeof pointNull).should.equal('undefined');
    });

    it('returns undefined when passed an number', () => {
      (typeof point1.add(10)).should.equal('undefined');
    });

    it('returns a new point-like object when given a point-Like object', () => {
      (Point.isPointLike(point3)).should.equal(true);
    });

    it('returns a new point whose x-cordinate is the sum of the x-cordinates of both input points', () => {
      (point3.x).should.equal(point1.x + point2.x);
    });

    it('returns a new point whose y-cordinate is the sum of the y-cordinates of both input points', () => {
      (point3.y).should.equal(point1.y + point2.y);
    });

  });
}

function test_isPointLike () {
  let testTypeStr,
      testTypeBool,
      testTypeFun,
      testTypeSym,
      testTypeNum,
      testTypeNumIsNaN,
      testTypeObjIsNull,
      point,
      point1,
      point2,
      pointThingObject,
      pointThingOneObject,
      pointThingOtherObject,
      pointThing,
      pointThingString,
      pointThingOneString,
      pointThingOtherString,
      pointThingNaN,
      pointThingOneNaN,
      pointThingOtherNaN,
      pointThingUndefined,
      pointThingOneUndefined,
      pointThingOtherUndefined,
      x,
      y;

  beforeEach(() => {
    //console.log('\t',);
    //point      = new Point(100, 150);
    //pointThing = { x: 5, y: 500 };
    //pointThingString = { x: 'timeX', y: 'forY' };
    //pointThingNaN = { x: NaN, y: NaN };
    //pointThingUndefined = { x: undefined, y: undefined };
  });

  describe('\n--------\n#isPointLike\n', () => {

    describe('returns false if given...', () => {

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

  });
}

function test_style () {
  describe('#style', () => {
    it('no tests exist', () => {
      (0).should.equal(1);
    });
  });
}



function test_delta () {
  /* static delta between 2 inputs 1 string 1 number,
  the return can be undefined
  the person calling should check for
  undefined rather than have the lower level mathy stuff throw an owenisms
  either return an UNDEFEFINED or correct */
  describe('#delta', () => {
    let thisPoint,
        otherPoint,
        samePoint,
        newPoint;

    beforeEach(() => {
      thisPoint  = new Point(100, 150);
      otherPoint = new Point(200, 250);
      samePoint  = new Point(100, 150);
      newPoint   = thisPoint.delta(otherPoint);
    });

    // test correct inputs
    it('returns a new object', () => {
      (typeof thisPoint.delta(otherPoint)).should.equal('object');
    });

    it('returns a new instance of Point class', () => {
      (thisPoint.delta(otherPoint) instanceof Point).should.equal(true);
    });

    it('returns a point whose x cordinate is the delta between the 2 points ', () => {
      (newPoint.x).should.equal(thisPoint.x - otherPoint.x);
    });

    /*// test malformed inputs
    it('fails how? when no value is passed?', () => {
      (thisPoint.delta()).should.equal({ x: 100, y: 150 });
    });
    */
  });
}


function test_subtract () {
  describe('#subtract', () => {
    it('no tests exist', () => {
      (0).should.equal(1);
    });
  });
}



function testConstructor () {
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
    let point;
    let clonedPoint;
    let cordinate = [];

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

function test_left () {
  describe('#left', () => {
    let point;

    beforeEach(() => {
      point = new Point(10,20);
    });

    it('returns the x-cordinate', () => {
      point.left.should.equal(10);
    });

    it('can not be changed', () => {
      () => {
        point.left = 1000;
      }.should.throw(Error);
    });
  });
}

function test_top () {
  describe('#top', () => {
    let point;

    beforeEach(() => {
      point = new Point(10,20);
    });

    it('returns the y-cordinate', () => {
      point.top.should.equal(20);
    });

    it('can not be changed', () => {
      () => {
        point.top = 1000;
      }.should.throw(Error);
    });
  });
}

function test_isOrigin () {
  describe('#isOrigin', () => {
    let point;
    let point1;
    let point2;

    beforeEach(() => {
      point = new Point(0,0);
      point1 = new Point(NaN);
      point2 = new Point(10,'this');
    });

    it("returns true if Point's location is 0,0", () => {
      point.isOrigin.should.equal(true);
    });

    it("returns true if 'NaN' is passed on contruction ", () => {
      point1.isOrigin.should.equal(true);
    });

    it("returns false if Point's location is other than 0,0", () => {
      point2.isOrigin.should.equal(false);
    });
  });
}

function test_equals () {
  describe('#equals', () => {
    let thisPoint,
        otherPoint,
        samePoint;

    beforeEach(() => {
      thisPoint  = new Point(100, 150);
      otherPoint = new Point(200, 250);
      samePoint  = new Point(100, 150);
    });

    // test correct inputs
    it("returns true when point1 and this.point share the same xy coordinates  ", () => {
      (thisPoint.equals(samePoint)).should.equal(true);
    });

    it("returns false when point1's and this.point's xy coordinates do NOT match ", () => {
      (thisPoint.equals(otherPoint)).should.equal(false);
    });

    // test malformed inputs
    it("returns false when no input is given ", () => {
      (thisPoint.equals()).should.equal(false);
    });

    it("returns false when passing a NaN ", () => {
      (thisPoint.equals(NaN)).should.equal(false);
    });

    it("returns false when passing a string ", () => {
      (thisPoint.equals('Hello, I am not a point')).should.equal(false);
    });

    it("returns false when passing a number", () => {
      (otherPoint.equals(10)).should.equal(false);
    });

  });
}

function test_integerize () {
  describe('#integerize', () => {
    let point;
    let integerizedPoint;
    let cordinate = [];

    beforeEach(() => {
      cordinate = [(Math.random()*MAX_X*2)-MIN_X, (Math.random()*MAX_Y*2)-MIN_Y];
      point = new Point(cordinate[0],cordinate[1]);
      integerizedPoint = point.integerize();
    });

    it("returns a NEW 'Point' converted to integers", () => {
      (integerizedPoint.left).should.equal(Math.floor(point.left));
    });

    it("removes decimals from the objects x,y cordinates", () => {
      (integerizedPoint.top).should.not.equal(point.top);
    });
  });

}



function test_size () {
  describe('#size', () => {
    let point;
    let mag;

    beforeEach(() => {
      point = new Point(50, 100);
      mag = point.size;
    });

    it('converts point cordinates into a vector and returns its magnitude.', () => {
      (mag).should.be.a('number');
    });
    it('returns a positive integer', () => {
      (mag).should.be.at.least(0);
    });
  });
}

function test_invert () {
  describe('#invert', () => {
    let point;
    let point2;
    let pointNaN;
    let pointNaN2;

    beforeEach(() => {
      point = new Point(50,100);
      point2 = point.invert();
      pointNaN = new Point(NaN, NaN);
      pointNaN2 = pointNaN.invert();
    });

    it('returns the inverse of an x,y point location', () => {
      (point.x).should.equal(point2.x*-1);
      (point.y).should.equal(point2.y*-1);
    });

    it('returns the inverse of null point location', () => {
      (pointNaN.x).should.equal(pointNaN2.x*-1);
      (pointNaN.y).should.equal(pointNaN2.y*-1);
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

import "babel-core/external-helpers";

let chai  = require('chai');
//    path  = require('path');

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
  test_direction();
  test_style();
  test_equals();
  test_integerize();
  test_delta();
  test_add();
  test_subtract();
  test_invert();
  test_size();
  test_toString();
});

function test_add () {
  describe('#add', () => {
    it('no tests exist', () => {
      (0).should.equal(1);
    });
  });
}

function test_subtract () {
  describe('#subtract', () => {
    it('no tests exist', () => {
      (0).should.equal(1);
    });
  });
}

function test_delta () {
  describe('#delta', () => {
    it('no tests exist', () => {
      (0).should.equal(1);
    });
  });
}

function test_direction () {
  describe('#direction', () => {
    it('no tests exist', () => {
      (0).should.equal(1);
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

function test_equals () {
  describe('#equals', () => {
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
  describe('#toString', () => {
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

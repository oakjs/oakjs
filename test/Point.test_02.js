
let chai  = require('chai');
//    path  = require('path');

chai.should();

// max and mins for cordinate system
let MAX_X = 200,
    MIN_X = 200,  // absolute value
    MAX_Y = 200,
    MIN_Y = 200;  // absolute value


import Point from '../src/oak-roots/Point';

//let Point = require(path.join(__dirname, '../src/oak-roots/Point'));


describe('Point', () => {

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
});




  /*
  describe('#constructor()', () => {
    it('requires two numerical arguments', () => {

      () => {
        new Point();
      }.should.throw(Error);


      () => {
        new Point(1.0);
      }.should.throw(Error);

      () => {
        new Point('this', 'that');
      }.should.throw(Error);

      () => {
        new Point(5, 10);
      }.should.not.throw(Error);
    });
  });
  */

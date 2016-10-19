import "babel-core/external-helpers";

var chai   = require('chai');
var expect = chai.expect;

import Point from "../src/oak-roots/Point";

// max and mins for cordinate system
var MAX_X = 200;
var MIN_X = 200;  // absolute value
var MAX_Y = 200;
var MIN_Y = 200;  // absolute value

var pointInstance;
var clonedPoint;
var cordinate = [];
var getCordinate = [];
var askIsOrigin;

describe('The Point.js module', function(){
  it('will return no error if it is successfully imported', function(){
    expect(1).to.be.deep.equal(1);
  });
});

describe("The Point.js class", function(){
  pointInstance = new Point(0,0);
  it('will return no error if an instance is generated', function(){
    expect(pointInstance.x).to.be.deep.equal(0);
  });
});

describe("An instance of the Point class", function(){
  var nextPointInstance;
  var randX;
  var randY;
  beforeEach(() => {
      randX = (Math.random()*MAX_X*2)-MIN_X;      // generates x-cordinate between MIN_X and MAX_X
      randY = (Math.random()*MAX_Y*2)-MIN_Y;      // generates y-cordinate between MIN_Y and MAX_Y
      nextPointInstance = new Point(randX,randY);
   });
   it("has valid x cordinate within max range of x", function(){
     expect(nextPointInstance.x).to.be.a('number');
     expect(nextPointInstance.x).to.be.deep.equal(randX);
     expect(nextPointInstance.x).to.be.below(MAX_X);
   });
   it("has valid y cordinate within max range y", function(){
     expect(nextPointInstance.y).to.be.a('number');
     expect(nextPointInstance.y).to.be.deep.equal(randY);
     expect(nextPointInstance.y).to.be.below(MAX_Y);
   });
});

describe("An instance of the Point class created with 1 or more NaNs as an argument", function(){
  var nanPointInstance;
  beforeEach(() => {
    nanPointInstance = new Point(0/0,NaN);
  });
   it("has NaN in x parameter replaced by zero", function(){
     expect(nanPointInstance.x).to.be.a('number');
     expect(nanPointInstance.x).to.be.deep.equal(0);
     expect(nanPointInstance.x).to.be.below(1);
   });
   it("has NaN in y parameter replaced by zero", function(){
     expect(nanPointInstance.y).to.be.a('number');
     expect(nanPointInstance.y).to.be.deep.equal(0);
     expect(nanPointInstance.y).to.be.below(1);
   });
});

describe("An instance of the Point class created with 1 or more strings as arugments", function(){
  var nanPointInstance;
  beforeEach(() => {
    nanPointInstance = new Point('stringX','stringY');
  });
   it("returns an error if x-cordinate is a string", function(){
     expect(nanPointInstance.x).to.not.be.a('number');
     expect(nanPointInstance.x).to.not.be.deep.equal(0);
     expect(nanPointInstance.x).to.not.be.below(1);
     expect(nanPointInstance.x).to.be.a('string');
   });
   it("returns an error if y-cordinate is a string", function(){
     expect(nanPointInstance.y).to.not.be.a('number');
     expect(nanPointInstance.y).to.not.be.deep.equal(0);
     expect(nanPointInstance.y).to.not.be.below(1);
     expect(nanPointInstance.y).to.be.a('string');
   });
});


describe("The clone() method of a Point object", function(){
  beforeEach(() => {
    cordinate = [(Math.random()*MAX_X*2)-MIN_X, (Math.random()*MAX_Y*2)-MIN_Y];
    pointInstance = new Point(cordinate[0],cordinate[1]);
    clonedPoint = pointInstance.clone();
  });
   it("creates and returns a new point object at the same x-cordinate", function(){
     expect(clonedPoint.x).to.be.a('number');
     expect(clonedPoint.x).to.be.deep.equal(pointInstance.x);
     expect(clonedPoint.x).to.not.be.below(cordinate[0]);
     console.log("\n\twhen point.x = " + pointInstance.x + ", clonedPoint.x = " + clonedPoint.x);
   });
   it("creates and returns a new point object at the same y-cordinate ", function(){
     expect(clonedPoint.y).to.be.a('number');
     expect(clonedPoint.y).to.be.deep.equal(pointInstance.y);
     expect(clonedPoint.y).to.not.be.below(cordinate[1]);
     expect(clonedPoint.y).to.be.below(MAX_Y);
     console.log("\n\twhen point.y = " + pointInstance.y + ", clonedPoint.y = " + clonedPoint.y);
   });
});


describe("The left() getter of a Point object", function(){
  beforeEach(() => {
    cordinate = [(Math.random()*MAX_X*2)-MIN_X, (Math.random()*MAX_Y*2)-MIN_Y];
    pointInstance = new Point(cordinate[0],cordinate[1]);
    getCordinate[0] = pointInstance.left;
  });
   it("returns the Point's x-cordinate property ", function(){
     expect(getCordinate[0]).to.be.a('number');
     expect(getCordinate[0]).to.be.deep.equal(pointInstance.x);
     expect(getCordinate[0]).to.be.below(MAX_X);
   });
});


describe("The top() getter of a Point object", function(){
  beforeEach(() => {
    cordinate = [(Math.random()*MAX_X*2)-MIN_X, (Math.random()*MAX_Y*2)-MIN_Y];
    pointInstance = new Point(cordinate[0],cordinate[1]);
    getCordinate[1] = pointInstance.top;
  });
   it("returns the Point's y-cordinate ", function(){
     expect(getCordinate[1]).to.be.a('number');
     expect(getCordinate[1]).to.be.deep.equal(pointInstance.y);
     expect(getCordinate[1]).to.be.below(MAX_Y);
   });
});

describe("The isOrigin() getter of a Point object", function(){
  var checkArrayLength = [];
  beforeEach(() => {
    pointInstance = new Point(0,0);
    askIsOrigin = pointInstance.isOrigin;
  });
   it("returns true if the Point's x,y cordinates are 0,0 ", function(){
     expect(askIsOrigin).to.be.equal(true);
     expect(askIsOrigin).to.be.a('boolean');
     expect(pointInstance.top).to.be.deep.equal(0);
     expect(pointInstance.left).to.be.deep.equal(0);
   });
});

describe("The isOrigin() getter of a Point object", function(){
  var checkArrayLength = [];
  beforeEach(() => {
    pointInstance = new Point(-10,10);
    askIsOrigin = pointInstance.isOrigin;
  });
   it("returns false if the Point is outside of the origin (0,0)) ", function(){
     expect(askIsOrigin).to.not.be.equal(true);
     expect(askIsOrigin).to.be.a('boolean');
     expect(pointInstance.top).to.be.a('number');
   });
});

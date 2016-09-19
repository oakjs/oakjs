//import Point from "../src/oak-roots/Point";

//Point  = require('../src/oak-roots/Point');
//const pointInstance = new Point();

var chai   = require('chai');
var expect = chai.expect;

var Point = require('../src/oak-roots/Point');

describe('The Point class', function(){
  it('will return no error if the class exists', function(){
    expect(1).to.be.deep.equal(1);
  });
});

var fortune = require('../lib/fortune');
var expect = require('chai').expect;


suite('fortune cookie tests', function(){
  test(' getFortune shoud return a string', function(){
    expect(typeof fortune.getFortune() === 'string');
  });
});

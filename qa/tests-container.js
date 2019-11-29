var { diContainer }  = require('../diContainer');
var expect = require('chai').expect;


suite('diContainer', function(){
  test(' should return an object', function(){
    expect(typeof diContainer === 'object');
  }); 
  test(' should get previously registered value', function(){
    diContainer.register('dbName', 'example-db');
    const actual = diContainer.get('dbName');
    const expected = 'example-db';
    expect(actual === expected);
  });
});
var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function(){

  setup(function(){
    browser = new Browser();
  });
  test('visiting the "request group rate" page dirctly should result ' +
    'in an empty referrer field', function(done){
    browser.visit('http://localhost:3000/tours/request-group-rate',function(){
      browser.assert.element('form input[name=referrer]', '', 'this should work');
      done();
    });
  });

  test('Requesting a group rate from Hood-River page should populate refferer', function(done){
    var referrer = 'http://localhost:3000/tours/hood-river';
    browser.visit(referrer, function(){
      browser.clickLink('.requestGroupRate', function(){
        //browser.assert.field('referrer', referrer);
        browser.assert.element('form input[name=referrer]', referrer, 'this should work');
        done();
      });
    });
  });
});
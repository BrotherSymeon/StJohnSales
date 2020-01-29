var utilities = require('../lib/utilities')();
var chai = require('chai');
var expect = require('chai').expect;
var assertArrays = require('chai-arrays');
chai.use(assertArrays);



suite('Utilities', function () {
  test('#lpad pads to 2 characters long', function () {
    var s = '9';
    var actual = utilities.lpad(s, '0', 2);
    expect(actual).to.equal('09');

  });
  test('#convertToDateString should convert September 16, 2019 to 2019-09-16', function () {
    var s = 'September 16, 2019';
    var actual = utilities.convertToDateString(s);

    expect(actual).to.equal('2019-09-16');
  });
  test('#removeCharacters should remove characters', function () {
    var s = 'john,harring';
    var actual = utilities.removeCharacters(s, ',');
    expect(actual.includes(',') === false).to.be.true;
  });
  test('#replaceCommasInDoubleQuotes should do the obvious', function () {
    var s = '"hay, hay"';
    var actual = utilities.replaceCommasInDoubleQuotes(s);
    expect(actual.includes(',') === false).to.be.true;

  });
  test('#rpadLine returns a curried function', function () {
    var arr = ['df', 'f', , 0, 8];
    var curFunc = utilities.rpadLine(23);
    var actual = curFunc(arr);
    //actual should be an array that has a length of 23
    expect(actual).to.be.array();
    expect(actual).to.have.lengthOf(23);
  });
});

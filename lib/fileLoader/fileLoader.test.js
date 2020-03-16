
var fileLoader = require('./index')();

const sqlResultExample = [[{BuyerInsert: 429}], [{Level: 'Error', Code: 1136, Message: 'Column count doesn\'t match value count at row 1'}], {fieldCount: 0, affectedRows: 0, insertId: 0, serverStatus: 34, warningCount: 0, message: '', protocol41: true, changedRows: 0}];
const sqlResultNoError = [[{BuyerInsert: 429}], {fieldCount: 0, affectedRows: 0, insertId: 0, serverStatus: 34, warningCount: 0, message: '', protocol41: true, changedRows: 0}];
const sqlResultNoExtra = [{fieldCount: 0, affectedRows: 0, insertId: 0, serverStatus: 34, warningCount: 0, message: '', protocol41: true, changedRows: 0}];

describe('fileLoader', function () {
  describe('#parseResults', function () {
    it('returns an Object with an error key and a results key', function () {

      var actual = fileLoader.parseResults(sqlResultExample);
      expect(Object.keys(actual).includes('error')).toBeTruthy();
      expect(Object.keys(actual).includes('results')).toBeTruthy();
      expect(Object.keys(actual).includes('extras')).toBeTruthy();
    });
    it('returns an Object with no error if non existed', function () {
      var actual = fileLoader.parseResults(sqlResultNoError);
      expect(actual).toBeInstanceOf(Object);
      expect(Object.keys(actual).includes('error')).toBeTruthy();
      expect(Object.keys(actual).includes('results')).toBeTruthy();
      expect(Object.keys(actual).includes('extras')).toBeTruthy();
      expect(actual.error).toBeFalsy();
    });
    it('can use find to get extra result values', function () {
      var actual = fileLoader.parseResults(sqlResultExample);
      expect(actual).toBeInstanceOf(Object);
      var b = actual.extras.find(function (x) {
        return Object.keys(x).includes('BuyerInsert');
      });
      expect(b.BuyerInsert).toBe(429);
    });
    it('returns an Object that has a getExtra function', function () {
      var actual = fileLoader.parseResults(sqlResultNoError);
      expect(actual).toBeInstanceOf(Object);
      expect(actual.getExtra).toBeInstanceOf(Function);
    });

    it(' Object#getExtra retruns a value if exists', function () {
      var actual = fileLoader.parseResults(sqlResultNoError);
      expect(actual).toBeInstanceOf(Object);
      expect(actual.getExtra('BuyerInsert')).toBe(429);
    });
    it(' Object#getExtra retruns undefined if not exists', function () {
      var actual = fileLoader.parseResults(sqlResultNoExtra);
      expect(actual).toBeInstanceOf(Object);
      expect(actual.getExtra('BuyerInsert')).toBe(undefined);
    });
  });
});

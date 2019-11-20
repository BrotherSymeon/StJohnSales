module.exports = class Enumeration {
  constructor(enumLabels) {
    var i = 0, LBL = '';
    this.MAX = enumLabels.length;
    this.labels = enumLabels;
    // generate the enum literals as capitalized keys/properties
    for (i; i <= enumLabels.length - 1; i++) {
      LBL = enumLabels[i].toUpperCase();
      this[LBL] = i;
    }
    // prevent any runtime change to the enumeration
    Object.freeze(this);
  }
};
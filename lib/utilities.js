module.exports = () => {
  const utilities = {};

  utilities.removeCharacters = function (str, remove) {
    var out = '';

    Array.from(str).forEach((i) => {
      if (i !== remove) {
        out += i;
      } else {
        out += '';
      }
    });
    return out;
  };
  utilities.rpadLine = function (length, line) {
    return function (line) {
      if (line.length < length) {
        line.length = length;
      }
      return line;
    };
  };
  utilities.convertToDateString = function (str) {
    var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dateParts = str.split(' ').map(part => part.replace(/[,]/g, ''));
    return dateParts[2] + '-' + utilities.lpad(String(months.indexOf(dateParts[0])), '0', 2) + '-' + utilities.lpad(dateParts[1], '0', 2);
  };
  utilities.lpad = function (str, padString, length) {
    while (str.length < length)
      str = padString + str;
    return str;
  };
  utilities.replaceCommasInDoubleQuotes = function (str) {
    var isBetweenQuotes = false;
    var out = '';
    Array.from(str).forEach((i) => {
      if (i === '"' && isBetweenQuotes === false) {
        isBetweenQuotes = true;
      } else if (i === '"' && isBetweenQuotes === true) {
        isBetweenQuotes = false;
      }

      if (i === ',' && isBetweenQuotes) {
        out += '';
      } else {
        out += i;
      }
    });

    return out;
  };

  return utilities;

};


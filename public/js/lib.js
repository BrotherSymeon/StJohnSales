  function convertHex (hex, opacity) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
  }

  function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function setText(elementId, txt) {
    
  }
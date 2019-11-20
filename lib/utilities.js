exports.removeCharacters = function(str, remove){
  var out = '';
  
  Array.from(str).forEach((i) =>{
    if(i !== remove){
      out += i;
    }else{
      out += '';
    }
  });
  return out;
};

exports.replaceCommasInDoubleQuotes = function(str){
  var isBetweenQuotes = false;
  var out = '';
  Array.from(str).forEach((i) => {
    if(i === '"' && isBetweenQuotes === false){
      isBetweenQuotes = true;
    }else if(i === '"' && isBetweenQuotes === true){
      isBetweenQuotes = false;
    }

    if(i === ',' && isBetweenQuotes){
      out += '';
    }else{
      out += i;
    }
  });

  return out;
};
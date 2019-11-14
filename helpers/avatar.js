exports.get = function(data){
  if(data.photos && data.photos[0]){
    return obj.photos[0].value;
  }else{
    return 'https://robohash.org/YOURXT.png'
  }
}
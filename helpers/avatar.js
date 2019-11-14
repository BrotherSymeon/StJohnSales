exports.get = function(data){
  if(data.photos && data.photos[0]){
    return data.photos[0].value;
  }else{
    const buf = crypto.randomBytes(5);
    return `https://robohash.org/${buf.toString('hex')}.png`;
  }
};
module.exports = function(route){
  return function(req, res, next = console.error) {
    return Promise.resolve(route(req, res)).catch(next);
  };
};
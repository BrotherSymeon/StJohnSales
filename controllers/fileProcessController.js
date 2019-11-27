let FileProcess = require('../models/FileProcess');
let FileProcessDetails = require('../models/FileProcessDetails');

exports.process_status = function(req, res){
  console.log(req.params.id);
  res.JSON(req.params.id);
};
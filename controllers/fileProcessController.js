let FileProcess = require('../models/FileProcess');
let FileProcessDetails = require('../models/FileProcessDetails');

exports.process_status = function(req, res){
  //console.log(req.params.id);
  var detail = new FileProcessDetails();
  detail.find('all', {where: 'FileId ='+req.params.id}, function(err, rows, fields){
    
  })
  res.json(req.params.id);
};
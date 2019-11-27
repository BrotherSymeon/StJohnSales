let FileProcess = require('../models/FileProcess');
let FileProcessDetails = require('../models/FileProcessDetails');

exports.process_status = function(req, res){
  var sql = ` SELECT * from  FileProcessDetails  where FileId = ${req.params.id} and FileProcessDetailId = (   select max(FileProcessDetailId) from FileProcessDetails WHERE FileId = ${req.params.id}  );`
  //console.log(req.params.id);
  var detail = new FileProcessDetails();
  detail.query(sql, function(err, rows, fields){
    res.json(rows);
  })
  //res.json(req.params.id);
};

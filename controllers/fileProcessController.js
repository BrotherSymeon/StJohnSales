

module.exports = function(processDetailsModel) {
  const fileProcessController = {};
  var Model = new processDetailsModel();
  fileProcessController.processStatus = function(req, res) {
    var id = req.params.id || 0;
    var sql = ` SELECT * from  FileProcessDetails  where FileId = ${req.params.id} and FileProcessDetailId = (   select max(FileProcessDetailId) from FileProcessDetails WHERE FileId = ${req.params.id}  );`
    Model.query(sql, function(err, rows, fields){
      if(err){
        console.log(err);
        res.status(500).send(err.message);
      }
     
      res.json(rows);
    });
  };
  return fileProcessController;
};
/* exports.process_status = function(req, res){
  var sql = ` SELECT * from  FileProcessDetails  where FileId = ${req.params.id} and FileProcessDetailId = (   select max(FileProcessDetailId) from FileProcessDetails WHERE FileId = ${req.params.id}  );`
  //console.log(req.params.id);
  var detail = new FileProcessDetails();
  detail.query(sql, function(err, rows, fields){
    if(err){
      console.log(err);
      res.status(500).send(err.message);
    }
    res.json(rows);
  })
  //res.json(req.params.id);
}; */

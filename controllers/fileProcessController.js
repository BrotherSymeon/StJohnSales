

module.exports = function (db) {
  const fileProcessController = {};
  var FileProcessesModel = new db.FileProcesses();
  fileProcessController.getProcesses = async function (req, res) {
    var id = req.params.id || 0;
    //var sql = ` SELECT * from  FileProcessDetails  where FileId = ${req.params.id} and FileProcessDetailId = (   select max(FileProcessDetailId) from FileProcessDetails WHERE FileId = ${req.params.id}  );`
    try {
      var processes = await FileProcessesModel.find('all', {});
      res.json(processes);
    } catch (err) {
      console.log('error in fileProcessController');
      console.log(err);
      res.status(500).send(err.message);
    }

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

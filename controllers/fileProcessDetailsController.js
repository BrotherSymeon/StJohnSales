module.exports =  function(db) {
  const fileProcessDetailsController = {};
  var FileProcessDetailsModel = new db.FileProcessDetails();
  fileProcessDetailsController.processStatus = async function(req, res) {
    var id = req.params.id || 0;
    var sql = ` SELECT * from  FileProcessDetails  where FileId = ${req.params.id} and FileProcessDetailId = (   select max(FileProcessDetailId) from FileProcessDetails WHERE FileId = ${req.params.id}  );`
    try{
      var status = await FileProcessDetailsModel.query(sql);
      res.json(status);
    }catch(err){
      console.log(err);
      res.status(500).send(err.message);
    }
    
  };
  return fileProcessDetailsController;
};
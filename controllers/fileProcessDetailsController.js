module.exports = function(db) {
  const fileProcessDetailsController = {};
  var FileProcessDetailsModel = new db.FileProcessDetails();
  fileProcessDetailsController.processStatus = async function(req, res) {
    var id = req.params.id || 0;
    var sql = ` SELECT pd.*, fp.ProcessStatus from
      FileProcessDetails pd
      INNER JOIN FileProcess fp
        ON fp.FileId = pd.FileId
      where fp.FileId = ${req.params.id} ORDER BY FileProcessDetailId DESC LIMIT 1;`;
    try {
      var status = await FileProcessDetailsModel.query(sql);
      res.json(status);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  };
  return fileProcessDetailsController;
};

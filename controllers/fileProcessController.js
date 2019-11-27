let FileProcess = require('../models/FileProcess');
let FileProcessDetails = require('../models/FileProcessDetails');

exports.process_status = (req, res) => {
  console.log(req.body.pocId);
  res.JSON(req.body.pocId);
};
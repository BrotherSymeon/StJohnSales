var User = require("../models/user");
var Sales = require("../models/sales");
var OrderHelper = require("../helpers/orders");
let FileProcess = require("../models/FileProcess");

exports.users_list = function(req, res) {
  res.send("NOT IMPLEMENTED: page to list users");
};

exports.users_detail = function(req, res) {
  res.send("NOT IMPLEMENTED: page to update user");
};

exports.users_new = function(req, res) {
  res.send("NOT IMPLEMENTED: page to create new user");
};

exports.user_create = function(req, res) {
  // a function
  res.send("NOT IMPLEMENTED: page to create new user");
};

exports.data_upload = function(req, res) {
  return res.render("upload", { title: "St Johns Sales - Upload Data" });
};

exports.upload_orders = async function(req, res) {
  var message = "Thank You, we will haave this done shortly";
  //req.fields; // contains non-file fields
  //console.log(req.file);// contains files
  var processId = 0;
  var thisres = res
  var process = new FileProcess({
    FileName: req.file.originalname,
    ProcessStatus: 'STARTED'
  });
  process.save(function(err, res) {
    processId = res.insertId;
    setTimeout(function() {
      OrderHelper.process(req.file.buffer.toString("utf-8"), {
        processId,
        fileName: req.file.originalname
      });
    }, 5000);
    return thisres.render('upload', {
      title: 'St Johns Sales - Upload Data',
      message: message,
      processId
    });
  });

  //console.log(req.file.buffer.toString("utf-8"));
  //do upload stuff
  //then return
};

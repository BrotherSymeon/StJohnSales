var User = require("../models/user");
var Sales = require("../models/sales");
var OrderHelper = require("../helpers/orders");
let FileProcess = require("../models/FileProcess");


module.exports = (processModel, orderService) => {
  const adminController = {};

  adminController.users_list = function(req, res) {
    res.send("NOT IMPLEMENTED: page to list users");
  };

  adminController.users_detail = function(req, res) {
    res.send("NOT IMPLEMENTED: page to update user");
  };
  adminController.users_new = function(req, res) {
    res.send("NOT IMPLEMENTED: page to create new user");
  };
  adminController.user_create = function(req, res) {
    // a function
    res.send("NOT IMPLEMENTED: page to create new user");
  };

  adminController.data_upload = function(req, res) {
    return res.render("upload", { title: "St Johns Sales - Upload Data" , processId: 0});
  };

  adminController.upload_orders = async function(req, response) {
    var message = "Thank You, we will haave this done shortly";
    //req.fields; // contains non-file fields
    //console.log(req.file);// contains files
    var processId = 0;
    
    var process = new processModel({
      FileName: req.file.originalname,
      ProcessStatus: 'STARTED'
    });

    process.save(function(err, res) {
      if(err){
        console.log(err.message);
        return response.render('upload', {
          title: 'St Johns Sales - Upload Data',
          err: err
        });
      }
      processId = res.insertId;
      setTimeout(function() {
        orderService.process(req.file.buffer.toString("utf-8"), {
          processId,
          fileName: req.file.originalname
        });
      }, 5000);
      return response.render('upload', {
        title: 'St Johns Sales - Upload Data',
        message: message,
        processId
      });
    });

  };

  return adminController;
};
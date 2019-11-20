var User = require('../models/user');
var Sales = require('../models/sales');

exports.users_list = function(req, res) {
   res.send('NOT IMPLEMENTED: page to list users');
};

exports.users_detail = function(req, res) {
   res.send('NOT IMPLEMENTED: page to update user');
};

exports.users_new = function(req, res) {
   res.send('NOT IMPLEMENTED: page to create new user');
};

exports.user_create = function(req, res) {
  // a function
   res.send('NOT IMPLEMENTED: page to create new user');
};

exports.data_upload = function (req, res) {
   return res.render('upload', { title : 'St Johns Sales - Upload Data'});
};


var Db = require('../gcpDb');

var FileProcess = function(file){
  this.fileId = file.fileId;
  this.fileName = file.fileName;
  this.processStatus = file.processStatus;
};

FileProcess.Create = function(newFileProcess, done){
  Db.get().query('INSERT 
}
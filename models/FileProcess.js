var Db = require('../gcpDb');

var FileProcess = function(file){
  this.fileId = file.fileId;
  this.fileName = file.fileName;
  this.processStatus = file.processStatus;
};

FileProcess.create = function(newFileProcess, done){
  Db.get().query('INSERT INTO FileProcess set ?', newFileProcess, function(err, res){
    if(err) {
      console.log('error: ', err);
      done(err, null);
    }
    console.log(res.insertId);
    done(null, res.insertId);
  });
};
FileProcess.find = funciton()
module.exports= FileProcess;
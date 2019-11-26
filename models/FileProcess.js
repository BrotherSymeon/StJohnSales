var Db = require('../gcpDb');

var FileProcess = function(file){
  this.FileId = file.fileId;
  this.FileName = file.fileName;
  this.ProcessStatus = file.processStatus;
};

FileProcess.create = function(newFileProcess, done){
  Db.get().query('INSERT INTO FileProcess set ?', newFileProcess, function(err, res){
    if(err) {
      console.log('error: ', err);
      done(err, null);
    }
    newFileProcess.FileId = res.insertId
    console.log(res.insertId);
    done(null, newFileProcess);
  });
};
FileProcess.find = funciton()
module.exports= FileProcess;
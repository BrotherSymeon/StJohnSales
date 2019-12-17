var fileUploader;
var expect = require('chai').expect;
var fs = require('fs')


suite('FileUploader', function(){
  suiteSetup( function(){
    var dbConfig = require('../config/db');
    var sqlConn = require('../lib/mysql-model2')(dbConfig);
    var conn = new sqlConn()
    conn.queryCallCount = 0;
    conn.queryOptionsCallCount = 0;
    conn.query = function(query, cb){
      this.queryCallCount++;
      console.log(query);
      retval = {};
      if(query.includes('INSERT')){
        retval.affectedRows = 1
      }else if(query.includes('UPDATE')){
        retval.affectedRows = 1
      }else{
        retval = [];
        retval.push({test:1});
      }
      cb(null, retval);
    };
    conn.queryOptions = function(query, options,  cb){
      this.queryOptionsCallCount++;
      console.log(query);
      retval = {};
      if(query.includes('INSERT')){
        retval.affectedRows = 1
      }else if(query.includes('INSERT')){
        retval.affectedRows = 1
      }else{
        retval = [];
        retval.push({test:1});
      }
      cb(null, retval);
    };
  
    fileUploader = require('../lib/fileLoader')(conn);
  });
  test(' should return an object', function(){
    expect(typeof fileUploader === 'object');
  }); 
  test('should be configurable', function() {
    const theData = ['sasdf', 'fdasd', 'ferqe'];
    fileUploader.init({
      processId: 9,
      fileName: 'myfilem',
      data: theData
    });
    expect(fileUploader.config.processId === 9);
    expect(fileUploader.config.fileName === 'myfile.csv');
    expect(fileUploader.config.data === theData);
  });
  test('should call query function', function(done) {
    fs.readFile('./qa/testData-Orders.csv', 'utf8', (err, data) => {
      if (err) throw err;

      //initialize Loader
    fileUploader.init({
      processId: 9,
      fileName: 'myfile.csv',
      data: data,
      tempInsertSQL: `INSERT INTO tempOrders( this, that)VALUES('me', 'you')`,
      tempTableName: 'tempOrders',
      loadDataSQL: 'loadDataProc',
      convertToNumberIndexes: [19,20,21,22,23],
      dataRowLength:35
    });

    var emit = fileUploader.process();

    emit.on('Done', function (data) {
      console.log(': ' + data);
      console.log(`queryCallCount=${fileUploader.connection.queryCallCount}`);
      console.log(`queryOptionsCallCount=${fileUploader.connection.queryOptionsCallCount}`)
      expect(fileUploader.connection.queryCallCount > 0);
      expect(fileUploader.connection.queryOptionsCallCount > 0);
      done();
     
    });

      
    });
    
  });
 
  
});
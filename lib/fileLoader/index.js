let emitter = require("events").EventEmitter;
let async = require("async");
const debug = require("debug");
const log = debug("sales:fileLoader");
const NUMBER_OF_STEPS = 3;
const FIRST_STEP = 1 / NUMBER_OF_STEPS;
const SECOND_STEP = 2 / NUMBER_OF_STEPS;
const THIRD_STEP = 3 / NUMBER_OF_STEPS;

module.exports = mySqlMultiConnection => {
  return new FileUploader(mySqlMultiConnection);
};

var FileUploader = function(conn) {
  this.connection = conn;
  this.config = {};
  this.config.fileName = "";
  this.config.processId = 0;
  this.config.data = ""; //this is the buffer toString fromthe uploaded file
  this.config.tempInsertSQL = ""; //insert statement
  this.config.tempTableName = ""; //name of temp table to do initial load into
  this.config.loadDataSQL = ""; //Stored PROC to run to load database
  this.config.convertToNumberIndexes = [];
  this.config.dataRowLength = 0;
  this.errors = [];
  this.events = {};
  this.events.BEGINFILEPROCESS = "BeginFileProcess";
  this.events.FILELINEPROCESS = "FileLineProcess";
  this.events.ENDFILEPROCESS = "EndFileProcess";
  this.events.BEGINDATAINSERTPROCESS = "BeginDataInsertProcess";
  this.events.CLEAREDTEMPTABLEPROCESS = "ClearedTempTableProcess";
  this.events.DONE = "Done";
  this.events.DONE_WITH_ERRORS = "DoneWithErrors";
  this.events.SAVEDDATALINE = "SavedDataLine";
  this.events.BEGINFINALPROCESSING = "BeginFinalProcessing";
  this.events.COMPLETEFINALPROCESSING = "CompleteFinalProcessing";
  this.events.ENDDATAINSERTPROCESS = "EndDataInsertProcess";

  Object.freeze(this.events);
};
FileUploader.prototype.init = function(config) {
  this.config = Object.assign(this.config, config);
  return this;
};
FileUploader.prototype.process = function() {
  var self = this;
  if (!this.config.data.length) {
    throw new Error("No data to process");
  }
  var processor = this._processFile();

  return processor;
};

FileUploader.prototype._processFile = function() {
  var e = new emitter();
  var self = this;
  setTimeout(() => {
    log("processing file %o", self.config.fileName);
    let cleanData = [];
    const lines = this.config.data.split("\n");
    e.emit(this.events.BEGINFILEPROCESS, {
      processId: self.config.processId,
      fileName: self.config.fileName,
      lineCount: lines.length,
      lineNumber: 0,
      percentDone: 0
    });

    cleanData = self._cleanUpLines(lines, e);

    e.emit(self.events.ENDFILEPROCESS, {
      processId: self.config.processId,
      fileName: self.config.fileName,
      lineCount: lines.length,
      percentDone: 1 * FIRST_STEP * 100
    });

    e.emit(self.events.BEGINDATAINSERTPROCESS, {
      processId: self.config.processId,
      fileName: self.config.fileName,
      lineCount: lines.length,
      percentDone: (1 / lines.length) * SECOND_STEP * 100
    });

    self._insertIntoTempTable(cleanData, e, function(results) {
      var inserted = results[results.length - 1];
      e.emit(self.events.ENDDATAINSERTPROCESS, {
        processId: self.config.processId,
        fileName: self.config.fileName,
        lineCount: lines.length,
        inserted: inserted,
        percentDone: 100,
        complete: false
      });
    });
  }, 500);
  return e;
};
FileUploader.prototype._insertIntoTempTable = function(lines, e, cb) {
  var rows = lines;
  var promises = [];
  var self = this;

  // delete from the tem table
  promises.push(function(done) {
    self.connection.query(
      self._deleteTempTableSQL(self.config.tempTableName),
      (err, result) => {
        if (err) {
          self.errors.push(err);
          return done(err);
        }

        e.emit(self.events.CLEAREDTEMPTABLEPROCESS, {
          processId: self.config.processId,
          lineCount: lines.length,
          fileName: self.config.fileName,
          percentDone: (lines.length / lines.length) * SECOND_STEP * 100
        });

        return done(null, result.affectedRows);
      }
    );
  });

  promises.push(function(done) {
    var batchInsert = "";

    rows.forEach((line, index) => {
      batchInsert +=
        self.connection.format(self.config.tempInsertSQL, [[line]]) + ";";
    });

    self.connection.query(batchInsert, (err, result) => {
      if (err) {
        self.errors.push(err);
        return done(null, err);
      }

      e.emit(self.events.SAVEDDATALINE, {
        processId: self.config.processId,
        fileName: self.config.fileName,
        lineCount: rows.length,
        affectedRows: result.affectedRows || 0,
        percentDone: 1 * THIRD_STEP * 100
      });
      return done(null, result);
    });
  });

  promises.push(function(done) {
    e.emit(self.events.BEGINFINALPROCESSING, {
      processId: self.config.processId,
      fileName: self.config.fileName,
      lineNumber: 0,
      lineCount: rows.length,
      percentDone: 1 * THIRD_STEP * 100
    });
    //run the Stored PROC
    self.connection.queryOptions(
      self.config.loadDataSQL,
      [self.config.processId],
      (err, result) => {
        if (err) {
          self.errors.push(err);
          return done(err);
        }

        e.emit(self.events.COMPLETEFINALPROCESSING, {
          processId: self.config.processId,
          fileName: self.config.fileName,
          lineNumber: 0,
          lineCount: rows.length,
          affectedRows: result.affectedRows,
          errors: self.errors,
          percentDone: 100
        });
        return done(null, result);
      }
    );
  });

  //run all the things
  async.series(promises, (err, results) => {
    if (err) {
      log("done witherrors %o , %o", err, self.errors);
      e.emit(self.events.DONE_WITH_ERRORS, {
        error: err,
        errors: self.errors,
        results: JSON.parse(JSON.stringify(results))
      });
    }
    //console.log(errors)
    log("overall results %o", JSON.parse(JSON.stringify(results)));
    e.emit(self.events.DONE, {
      processId: self.config.processId,
      fileName: self.config.fileName,
      message: "Done",
      percentDone: 100,
      errors: self.errors,
      results: JSON.parse(JSON.stringify(results))
    });
    if (cb) {
      cb(JSON.parse(JSON.stringify(results)));
    }
  });
};
FileUploader.prototype._cleanUpLines = function(lines, e) {
  let retVal = [];
  lines.forEach((val, i, array) => {
    if (i > 1) {
      val = this._replaceCommasInDoubleQuotes(val);
      let lineData = val.split(",");
      lineData.forEach((elem, index) => {
        if (this.config.convertToNumberIndexes.includes(index)) {
          lineData[index] = Number(this._removeCharacters(elem, '"'));
        } else {
          lineData[index] = this._removeCharacters(elem, '"');
        }
      });
      if (lineData.length === this.config.dataRowLength) {
        retVal.push(lineData);

        e.emit(this.events.FILELINEPROCESS, {
          processId: this.config.processId,
          fileName: this.config.fileName,
          processedLine: lineData,
          lineCount: lines.length,
          lineNumber: i,
          percentDone: (i / lines.length) * FIRST_STEP * 100
        });
      }
    }
  });
  return retVal;
};

FileUploader.prototype._deleteTempTableSQL = function(tableName) {
  return `DELETE FROM ${tableName};`;
};

FileUploader.prototype._removeCharacters = function(str, remove) {
  var out = "";

  Array.from(str).forEach(i => {
    if (i !== remove) {
      out += i;
    } else {
      out += "";
    }
  });
  return out;
};

FileUploader.prototype._replaceCommasInDoubleQuotes = function(str) {
  var isBetweenQuotes = false;
  var out = "";
  Array.from(str).forEach(i => {
    if (i === '"' && isBetweenQuotes === false) {
      isBetweenQuotes = true;
    } else if (i === '"' && isBetweenQuotes === true) {
      isBetweenQuotes = false;
    }

    if (i === "," && isBetweenQuotes) {
      out += "";
    } else {
      out += i;
    }
  });

  return out;
};
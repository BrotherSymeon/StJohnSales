const debug = require("debug");
const log = debug("sales:uploadeventHandler");

module.exports = db => {
  const handler = {};
  handler._saveProcessDetail = async (data, messageType) => {
    try {
      var detail = new db.FileProcessDetails({
        DetailType: messageType || "MESSAGE",
        DetailMessage: data.message,
        FileId: data.processId,
        PercentDone: data.percentDone || 0
      });
      await detail.save();
    } catch (err) {
      log("#saveProcessDetail err %o", err.message);
    }
  };
  handler._saveProcessStatus = async (data, statusMessage) => {
    var status = new db.FileProcesses();
    var sqlStmt = `UPDATE FileProcess SET ProcessStatus = '${statusMessage}' WHERE FileId = ${data.processId} ;`;
    try {
      log("#saveProcessStatus sql= %o", sqlStmt);
      await status.query(sqlStmt);
    } catch (err) {
      log("#saveProcessStatus err %o", err.message);
    }
  };
  handler.handleEvents = emitter => {
    emitter.on("BeginFileProcess", function(data) {
      data.message = `BeginFileProcess: Transforming ${data.fileName}: ${data.lineCount} lines of data to process.`;
      handler._saveProcessDetail(data);
    });
    emitter.on("FileLineProcess", function(data) {
      data.message = `FileLineProcess: Transforming ${data.fileName}:processing line:${data.lineNumber} of ${data.lineCount} lines of data to process.`;
      handler._saveProcessDetail(data);
    });
    emitter.on("EndFileProcess", function(data) {
      data.message = `EndFileProcess: Transformed ${data.fileName}: ${data.lineCount} lines of data to process.`;
      handler._saveProcessDetail(data);
    });
    emitter.on("BeginDataInsertProcess", function(data) {
      data.message = `BeginDataInsertProcess: Loading ${data.fileName}: ${data.lineCount} lines of data to load.`;
      handler._saveProcessDetail(data);
    });
    emitter.on("EndDataInsertProcess", function(data) {
      data.message = `EndDataInsertProcess: Loading ${data.fileName}: ${data.lineCount} lines of data to load.`;
      handler._saveProcessDetail(data);
    });
    emitter.on("ClearedPrepTableProcess", function(data) {
      data.message = `ClearedPrepTableProcess: For ${data.fileName}.`;
      handler._saveProcessDetail(data);
    });
    emitter.on("SavedDataLine", function(data) {
      data.message = `ClearedPrepTableProcess: Loading ${data.fileName}: ${data.lineCount} lines of data to process.`;
      handler._saveProcessDetail(data);
      //console.log('Saved Data Line to tempOrders table: ', data);
    });
    emitter.on("BeginFinalProcessing", function(data) {
      data.message = `BeginFinalProcessing: Running Stored Procedure ${data.fileName}:`;
      handler._saveProcessDetail(data);
    });
    emitter.on("CompleteFinalProcessing", function(data) {
      data.message = `CompleteFinalProcessing: Procedure Completed for ${data.fileName}:`;
      handler._saveProcessDetail(data);
    });
    emitter.on("Done", function(data) {
      log("Done event recieved %o", data);
      data.message = `Done: Processing ${data.fileName}:`;
      handler._saveProcessStatus(data, "FINISHED");
    });
    emitter.on("DoneWithErrors", function(data) {
      log("Done With errors recieved %o", data);
      data.message = `Done With Errors: Processing ${data.fileName}:`;
      handler._saveProcessStatus(data, "ERROR");
    });
  };
  return handler;
};

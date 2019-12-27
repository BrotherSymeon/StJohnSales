var Enumeration = require('../lib/enumeration');


module.exports = (db, fileLoaderSvc) => {
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
    return res.render("upload", {
      title: "St Johns Sales - Upload Data",
      processId: 0
    });
  };

  adminController.upload_orders = async function(req, response) {
    var message = "Thank You, we will have this done shortly";
    //req.fields; // contains non-file fields
    //console.log(req.file);// contains files
    var processId = 0;
    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: 'STARTED'
    });

    process.save(function(err, res) {
      if (err) {
        console.log(err.message);
        return response.render('upload', {
          title: 'St Johns Sales - Upload Data',
          err: err
        });
      }
      processId = res.insertId;
      var OrderColumns = new Enumeration([
        'SaleDate',
        'OrderId',
        'BuyerUserId',
        'FullName',
        'FirstName',
        'LastName',
        'NumberOfItems',
        'PaymentMethod',
        'DateShipped',
        'Street1',
        'Street2',
        'ShipCity',
        'ShipState',
        'ShipZipCode',
        'ShipCountry',
        'Currency',
        'OrderValue',
        'CouponCode',
        'CouponDetails',
        'DiscountAmount',
        'ShippingDiscount',
        'Shipping',
        'SalesTax',
        'OrderTotal',
        'Status',
        'CardProcessingFees',
        'OrderNet',
        'AdjustedOrderTotal',
        'AdjustedCardProcessingFees',
        'AdjustedNetOrderAmount',
        'Buyer',
        'OrderType',
        'PaymentType',
        'InPersonDiscount',
        'InPersonLocation'
      ]);


      var e = fileLoaderSvc.init({
        processId: processId,
        fileName: req.file.originalname,
        data: req.file.buffer.toString("utf-8"),
        tempInsertSQL: `INSERT INTO tempOrders(SaleDate,OrderId,BuyerUserId,FullName,FirstName,LastName,NumberOfItems,PaymentMethod,DateShipped,Street1,Street2,ShipCity,ShipState,ShipZipCode,ShipCountry,Currency,OrderValue,CouponCode,CouponDetails,DiscountAmount,ShippingDiscount,Shipping,SalesTax,OrderTotal,Status,CardProcessingFees,OrderNet,AdjustedOrderTotal,AdjustedCardProcessingFees,AdjustedNetOrderAmount,Buyer,OrderType,PaymentType,InPersonDiscount,InPersonLocation)  VALUES ?`,
        tempTableName: 'tempOrders',
        loadDataSQL: 'CALL LoadOrders(?)',
        convertToNumberIndexes: [OrderColumns.ADJUSTEDCARDPROCESSINGFEES,
          OrderColumns.ADJUSTEDNETORDERAMOUNT,
          OrderColumns.CARDPROCESSINGFEES,
          OrderColumns.INPERSONDISCOUNT,
          OrderColumns.ADJUSTEDORDERTOTAL,
          OrderColumns.ORDERTOTAL,
          OrderColumns.SHIPPING,
          OrderColumns.SHIPPINGDISCOUNT,
          OrderColumns.SALESTAX,
          OrderColumns.DISCOUNTAMOUNT,
          OrderColumns.ORDERVALUE,
          OrderColumns.ORDERNET
        ],
        dataRowLength: 35
      }).process();


      e.on('BeginFileProcess', function(data) {

        data.message = `BeginFileProcess: Processing ${data.fileName}: ${data.lineCount} lines of data to process.`;
        adminController._saveProcessDetail(data);

      });
      e.on('FileLineProcess', function(data) {
        data.message = `FileLineProcess: Processing ${data.fileName}: ${data.lineCount} lines of data to process.`;
        adminController._saveProcessDetail(data);

      });
      e.on('EndFileProcess', function(data) {
        data.message = `EndFileProcess: Processing ${data.fileName}: ${data.lineCount} lines of data to process.`;
        adminController._saveProcessDetail(data);

      });
      e.on('BeginDataInsertProcess', function(data) {
        data.message = `BeginDataInsertProcess: Processing ${data.fileName}: ${data.lineCount} lines of data to process.`;
        adminController._saveProcessDetail(data);
      });
      e.on('EndDataInsertProcess', function(data) {
        data.message = `EndDataInsertProcess: Processing ${data.fileName}: ${data.lineCount} lines of data to process.`;
        adminController._saveProcessDetail(data);
      });
      e.on('ClearedPrepTableProcess', function(data) {
        data.message = `ClearedPrepTableProcess: Processing ${data.fileName}.`;
        adminController._saveProcessDetail(data);
      });
      e.on('SavedDataLine', function(data) {
        data.message = `ClearedPrepTableProcess: Processing ${data.fileName}: ${data.lineCount} lines of data to process.`;
        adminController._saveProcessDetail(data);
        //console.log('Saved Data Line to tempOrders table: ', data);
      });
      e.on('BeginFinalProcessing', function(data) {
        data.message = `BeginFinalProcessing: Processing ${data.fileName}:`;
        adminController._saveProcessDetail( data);
      });
      e.on('CompleteFinalProcessing', function(data) {
        data.message = `CompleteFinalProcessing: Processing ${data.fileName}:`;
        adminController._saveProcessDetail(data);
      });
      e.on('Done', function(data) {
        data.message = `Done: Processing ${data.fileName}:`;
        adminController._saveProcessStatus(data, 'FINISHED');
      });
      e.on(fileLoaderSvc.events.DONE_WITH_ERRORS, function(data) {
        data.message = `Done With Errors: Processing ${data.fileName}:`;
        adminController._saveProcessStatus(data, 'ERROR');
      });




      return response.render('upload', {
        title: 'St Johns Sales - Upload Data',
        message: message,
        processId: processId
      });

    });


  };

  adminController._saveProcessStatus = function(data, statusMessage) {
    var status = new db.FileProcesses();
    status.find('first', {WHERE: `FileId=${data.processId}`},(err, result) => {
      if(err){
        console.log(err);
        return;
      }
      // set the status
      status.ProcessStatus = statusMessage;
      status.save((err, result) => {
        if(err){
          return console.log(err.meassage);
        }
        if(statusMessage === 'ERROR'){
          adminController._saveProcessDetail({
            message: data.errors.join('|'),
            processId: data.processId,
            percentDone: 100
          }, 'ERROR');
        }
      });

    });
  };
  adminController._saveProcessDetail= function(data, messageType){
    var detail = new db.FileProcessDetails({
       DetailType: messageType || 'MESSAGE',
       DetailMessage: data.message,
       FileId: data.processId,
       PercentDone: data.percentDone || 0
     });
     detail.save((err, result) => {
       if(err) console.log(err);
       //console.log(result);
     });
  };
  adminController.upload_order_items = async function(req, response) {
    var message = "Thank You, we will have this done shortly";

    var processId = 0;

    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: 'STARTED'
    });

    process.save(function(err, res) {
      if (err) {
        console.log(err.message);
        return response.render('upload', {
          title: 'St Johns Sales - Upload Data',
          err: err
        });
      }
      processId = res.insertId;
      setTimeout(function() {
        orderItemsService.process(req.file.buffer.toString("utf-8"), {
          processId,
          fileName: req.file.originalname
        });
      }, 500);
      return response.render('upload', {
        title: 'St Johns Sales - Upload Data',
        message: message,
        processId
      });
    });
  }

  return adminController;
};

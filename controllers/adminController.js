


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
    return res.render("upload", { title: "St Johns Sales - Upload Data" , processId: 0});
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
      if(err){
        console.log(err.message);
        return response.render('upload', {
          title: 'St Johns Sales - Upload Data',
          err: err
        });
      }
      processId = res.insertId;
      setTimeout(() => {
        
        fileLoaderSvc.init({ 
          processId: processId,
          fileName: req.file.originalname,
          data: req.file.buffer.toString("utf-8"),
          tempInsertSQL: `INSERT INTO tempOrders(SaleDate,OrderId,BuyerUserId,FullName,FirstName,LastName,NumberOfItems,PaymentMethod,DateShipped,Street1,Street2,ShipCity,ShipState,ShipZipCode,ShipCountry,Currency,OrderValue,CouponCode,CouponDetails,DiscountAmount,ShippingDiscount,Shipping,SalesTax,OrderTotal,Status,CardProcessingFees,OrderNet,AdjustedOrderTotal,AdjustedCardProcessingFees,AdjustedNetOrderAmount,Buyer,OrderType,PaymentType,InPersonDiscount,InPersonLocation)  VALUES ?`,
          tempTableName: 'tempOrders',
          loadDataSQL: 'loadDataProc',
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
            OrderColumns.ORDERNET],
          dataRowLength:35
        }).process();




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
      'InPersonLocation']);

  };

  adminController.upload_order_items = async function(req, response) {
    var message = "Thank You, we will have this done shortly";

    var processId = 0;
    
    var process = new db.FileProcesses({
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
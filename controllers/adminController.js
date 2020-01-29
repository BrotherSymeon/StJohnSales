var Enumeration = require("../lib/enumeration");
const debug = require("debug");
const log = debug("sales:controller:admin");
module.exports = (db, fileLoaderSvc, eventHandler, utils) => {
  const adminController = {};

  /**
   * users_list
   *
   * @param req
   * @param res
   * @returns {undefined}
   */
  adminController.users_list = function (req, res) {
    res.send("NOT IMPLEMENTED: page to list users");
  };

  /**
   * users_detail
   *
   * @param req
   * @param res
   * @returns {undefined}
   */
  adminController.users_detail = function (req, res) {
    res.send("NOT IMPLEMENTED: page to update user");
  };
  /**
   * users_new
   *
   * @param req
   * @param res
   * @returns {undefined}
   */
  adminController.users_new = function (req, res) {
    res.send("NOT IMPLEMENTED: page to create new user");
  };
  /**
   * user_create
   *
   * @param req
   * @param res
   * @returns {undefined}
   */
  adminController.user_create = function (req, res) {
    // a function
    res.send("NOT IMPLEMENTED: page to create new user");
  };

  /**
   * data_upload
   * Renders the upload template
   *
   * @param req
   * @param res
   * @returns {undefined}
   */
  adminController.data_upload = function (req, res) {
    return res.render("upload", {
      title: "St Johns Sales - Upload Data",
      processId: 0
    });
  };

  /**
   * Uploads Order file
   *
   * @param req
   * @param response
   * @returns {undefined}
   */
  adminController.upload_orders = async function (req, response) {
    log("uploading orders file name: %o", req.file.originalname);
    var message = "Thank You, for uploading your Etsy Orders File, we will have this done shortly";
    var funcError = null;

    //console.log(req.file);// contains files
    var processId = 0;
    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: "STARTED"
    });

    try {
      await process.query(
        adminController.sqlCleanupFileProcessTable()
      );

      var newProc = await process.save();
      processId = newProc.insertId;
      log("new process created in db FileProcessId=%o", processId);
      var e = fileLoaderSvc
        .init({
          processId: processId,
          fileName: req.file.originalname,
          data: req.file.buffer.toString("utf-8"),
          tempInsertSQL: `INSERT INTO tempOrders(SaleDate,OrderId,BuyerUserId,FullName,FirstName,LastName,NumberOfItems,PaymentMethod,DateShipped,Street1,Street2,ShipCity,ShipState,ShipZipCode,ShipCountry,Currency,OrderValue,CouponCode,CouponDetails,DiscountAmount,ShippingDiscount,Shipping,SalesTax,OrderTotal,Status,CardProcessingFees,OrderNet,AdjustedOrderTotal,AdjustedCardProcessingFees,AdjustedNetOrderAmount,Buyer,OrderType,PaymentType,InPersonDiscount,InPersonLocation)  VALUES ?`,
          tempTableName: "tempOrders",
          loadDataSQL: "CALL LoadOrders(?)",
          convertToNumberIndexes: [
            OrderColumns.ADJUSTEDCARDPROCESSINGFEES,
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
            OrderColumns.ORDERNET,
            OrderColumns.NUMBEROFITEMS
          ],
          dataRowLength: 35
        })
        .process();

      eventHandler.handleEvents(e);
    } catch (err) {
      log("error %o", err);
      funcError = err;
    } finally {
      return response.render("upload", {
        title: "St Johns Sales - Upload Data",
        error: funcError ? funcError.message : null,
        message: message,
        processId: processId
      });
    }
  };
  adminController.upload_payments = async function (req, res) {
    log('uploading payments file name: %o', req.file.originalname);
    var message = "Thank You for uploading your Payments file. We will have this done shortly";

    var funcError = null;
    //console.log(req.file);// contains files
    var processId = 0;
    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: "STARTED"
    });

    try {
      await process.query(
        adminController.sqlCleanupFileProcessTable()
      );

      var newProc = await process.save();
      processId = newProc.insertId;
      log("new process created in db FileProcessId=%o", processId);
      var e = fileLoaderSvc
        .init({
          processId: processId,
          fileName: req.file.originalname,
          data: req.file.buffer.toString("utf-8"),
          tempInsertSQL: `INSERT INTO tempEtsyPayment(PaymentID, BuyerUsername, BuyerName, OrderID, GrossAmount, Fees, NetAmount, PostedGross, PostedFees, PostedNet, AdjustedGross, AdjustedFees, AdjustedNet, Currency,ListingAmount, ListingCurrency, ExchangeRate, VATAmount, GiftCardApplied, Status, FundsAvailable,OrderDate,Buyer,OrderType,PaymentType, RefundAmount)  VALUES ?`,
          tempTableName: "tempEtsyPayment",
          loadDataSQL: "CALL LoadEtsyPayments()",
          convertToNumberIndexes: [
            PaymentColumns.GROSSAMOUNT,
            PaymentColumns.FEES,
            PaymentColumns.NETAMOUNT,
            PaymentColumns.POSTEDGROSS,
            PaymentColumns.POSTEDFEES,
            PaymentColumns.POSTEDNET,
            PaymentColumns.ADJUSTEDGROSS,
            PaymentColumns.ADJUSTEDFEES,
            PaymentColumns.ADJUSTEDNET,
            PaymentColumns.LISTINGAMOUNT,
            PaymentColumns.EXCHANGERATE,
            PaymentColumns.VATAMOUNT,
            PaymentColumns.REFUNDAMOUNT
          ],
          dataRowLength: 26
        })
        .process();

      eventHandler.handleEvents(e);
    } catch (err) {
      log("error %o", err);
      funcError = err;
    } finally {
      return res.render("upload", {
        title: "St Johns Sales - Upload Data",
        error: funcError ? funcError.message : null,
        message: message,
        processId: processId
      });
    }
  };
  adminController.fixDate = function (line) {
    if (line && line.length && line[0].length) {
      log('before conversion %o', line[0]);
      line[0] = utils.convertToDateString(line[0]);
      log('after conversion %o', line[0]);
    }
    return line;
  };
  adminController.upload_deposits = async function (req, res) {
    log('uploading deposits file name: %o', req.file.originalname);
    var message = "Thank You for uploading your Deposits file. We will have this done shortly";

    var funcError = null;
    //console.log(req.file);// contains files
    var processId = 0;
    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: "STARTED"
    });

    try {
      await process.query(
        adminController.sqlCleanupFileProcessTable()
      );

      var newProc = await process.save();
      processId = newProc.insertId;
      log("new process created in db FileProcessId=%o", processId);
      var e = fileLoaderSvc
        .init({
          processId: processId,
          fileName: req.file.originalname,
          data: req.file.buffer.toString("utf-8"),
          tempInsertSQL: `INSERT INTO tempEtsyDeposit(DepositDate, Amount, Currency, Status, AccountEndingDigits)  VALUES ?`,
          tempTableName: "tempEtsyDeposit",
          loadDataSQL: "CALL LoadEtsyDeposits()",
          processLineFunction: adminController.fixDate,
          convertToNumberIndexes: [
            DepositColumns.AMOUNT,
            DepositColumns.BANKACCOUNTENDINGDIGITS
          ],
          dataRowLength: 5
        })
        .process();

      eventHandler.handleEvents(e);
    } catch (err) {
      log("error %o", err);
      funcError = err;
    } finally {
      return res.render("upload", {
        title: "St Johns Sales - Upload Data",
        error: funcError ? funcError.message : null,
        message: message,
        processId: processId
      });
    }

  };
  adminController.upload_listings = async function (req, res) {
    log('uploading listings file name: %o', req.file.originalname);
    var message = "Thank You for uploading your Listings file. We will have this done shortly";

    var funcError = null;

    //console.log(req.file);// contains files
    var processId = 0;
    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: "STARTED"
    });

    try {
      await process.query(
        adminController.sqlCleanupFileProcessTable()
      );

      var newProc = await process.save();
      processId = newProc.insertId;
      log("new process created in db FileProcessId=%o", processId);
      var e = fileLoaderSvc
        .init({
          processId: processId,
          fileName: req.file.originalname,
          data: req.file.buffer.toString("utf-8"),
          tempInsertSQL: `INSERT INTO tempEtsyListing(TITLE,DESCRIPTION,PRICE,CURRENCY_CODE,QUANTITY,TAGS,MATERIALS,IMAGE1,IMAGE2,IMAGE3,IMAGE4,IMAGE5,IMAGE6,IMAGE7,IMAGE8,IMAGE9,IMAGE10,VARIATION1TYPE,VARIATION1NAME,VARIATION1VALUES,VARIATION2TYPE,VARIATION2NAME,VARIATION2VALUES)  VALUES ?`,
          tempTableName: "tempEtsyListing",
          loadDataSQL: "CALL LoadEtsyListings()",
          processLineFunction: utils.rpadLine(23),
          convertToNumberIndexes: [
            ListingColumns.QUANTITY,
            ListingColumns.PRICE
          ],
          dataRowLength: 23
        })
        .process();

      eventHandler.handleEvents(e);
    } catch (err) {
      log("error %o", err);
      funcError = err;
    } finally {
      return res.render("upload", {
        title: "St Johns Sales - Upload Data",
        error: funcError ? funcError.message : null,
        message: message,
        processId: processId
      });
    }


  };
  adminController.upload_order_items = async function (req, response) {
    log("uploading order items file name: %o", req.file.originalname);
    var message = "Thank You for uploading your Order Items. We will have this done shortly";
    var funcError = null;

    //console.log(req.file);// contains files
    var processId = 0;
    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: "STARTED"
    });

    try {
      await process.query(
        adminController.sqlCleanupFileProcessTable()
      );

      var newProc = await process.save();
      processId = newProc.insertId;
      log("new process created in db FileProcessId=%o", processId);
      var e = fileLoaderSvc
        .init({
          processId: processId,
          fileName: req.file.originalname,
          data: req.file.buffer.toString("utf-8"),
          tempInsertSQL: `INSERT INTO tempOrderItems(SaleDate,ItemName,Buyer,Quantity,Price,CouponCode,CouponDetails,DiscountAmount,ShippingDiscount,OrderShipping,OrderSalesTax,ItemTotal,Currency,TransactionID,ListingID,DatePaid,DateShipped,ShipName,ShipAddress1,ShipAddress2,ShipCity,ShipState,ShipZipCode,ShipCountry,OrderId,Variations,OrderType,ListingsType,PaymentType,InPersonDiscount,InPersonLocation,VATPaidbyBuyer)  VALUES ?`,
          tempTableName: "tempOrderItems",
          loadDataSQL: "CALL LoadOrderItems()",
          convertToNumberIndexes: [
            OrderItemColumns.QUANTITY,
            OrderItemColumns.PRICE,
            OrderItemColumns.DISCOUNTAMOUNT,
            OrderItemColumns.SHIPPINGDISCOUNT,
            OrderItemColumns.ORDERSHIPPING,
            OrderItemColumns.ORDERSALESTAX,
            OrderItemColumns.ITEMTOTAL,
            OrderItemColumns.SHIPPINGDISCOUNT,
            OrderItemColumns.INPERSONDISCOUNT,
            OrderItemColumns.VATPAIDBYBUYER
          ],
          dataRowLength: 32
        })
        .process();

      eventHandler.handleEvents(e);
    } catch (err) {
      log("error %o", err);
      funcError = err;
    } finally {
      return response.render("upload", {
        title: "St Johns Sales - Upload Data",
        error: funcError ? funcError.message : null,
        message: message,
        processId: processId
      });
    }
  };
  var DepositColumns = new Enumeration([
    "Date",
    "Amount",
    "Currency",
    "Status",
    "BankAccountEndingDigits"
  ]);

  var PaymentColumns = new Enumeration([
    "PaymentID",
    "BuyerUsername",
    "BuyerName",
    "OrderID",
    "GrossAmount",
    "Fees",
    "NetAmount",
    "PostedGross",
    "PostedFees",
    "PostedNet",
    "AdjustedGross",
    "AdjustedFees",
    "AdjustedNet",
    "Currency",
    "ListingAmount",
    "ListingCurrency",
    "ExchangeRate",
    "VATAmount",
    "GiftCardApplied",
    "Status",
    "FundsAvailable",
    "OrderDate",
    "Buyer",
    "OrderType",
    "PaymentType",
    "RefundAmount"
  ]);
  var OrderColumns = new Enumeration([
    "SaleDate",
    "OrderId",
    "BuyerUserId",
    "FullName",
    "FirstName",
    "LastName",
    "NumberOfItems",
    "PaymentMethod",
    "DateShipped",
    "Street1",
    "Street2",
    "ShipCity",
    "ShipState",
    "ShipZipCode",
    "ShipCountry",
    "Currency",
    "OrderValue",
    "CouponCode",
    "CouponDetails",
    "DiscountAmount",
    "ShippingDiscount",
    "Shipping",
    "SalesTax",
    "OrderTotal",
    "Status",
    "CardProcessingFees",
    "OrderNet",
    "AdjustedOrderTotal",
    "AdjustedCardProcessingFees",
    "AdjustedNetOrderAmount",
    "Buyer",
    "OrderType",
    "PaymentType",
    "InPersonDiscount",
    "InPersonLocation"
  ]);

  var OrderItemColumns = new Enumeration([
    "SaleDate",
    "ItemName",
    "Buyer",
    "Quantity",
    "Price",
    "CouponCode",
    "CouponDetails",
    "DiscountAmount",
    "ShippingDiscount",
    "OrderShipping",
    "OrderSalesTax",
    "ItemTotal",
    "Currency",
    "TransactionID",
    "ListingID",
    "DatePaid",
    "DateShipped",
    "ShipName",
    "ShipAddress1",
    "ShipAddress2",
    "ShipCity",
    "ShipState",
    "ShipZipcode",
    "ShipCountry",
    "OrderID",
    "Variations",
    "OrderType",
    "ListingsType",
    "PaymentType",
    "InPersonDiscount",
    "InPersonLocation",
    "VATPaidbyBuyer"
  ]);

  var ListingColumns = new Enumeration([
    "TITLE",
    "DESCRIPTION",
    "PRICE",
    "CURRENCY_CODE",
    "QUANTITY",
    "TAGS",
    "MATERIALS",
    "IMAGE1",
    "IMAGE2",
    "IMAGE3",
    "IMAGE4",
    "IMAGE5",
    "IMAGE6",
    "IMAGE7",
    "IMAGE8",
    "IMAGE9",
    "IMAGE10",
    "VARIATION1TYPE",
    "VARIATION1NAME",
    "VARIATION1VALUES",
    "VARIATION2TYPE",
    "VARIATION2NAME",
    "VARIATION2VALUES"
  ]);
  adminController.sqlCleanupFileProcessTable = function () {
    return "DELETE FROM FileProcess WHERE CreatedOn < DATE_SUB( NOW(), INTERVAL 2 DAY);"
  };

  return adminController;
};

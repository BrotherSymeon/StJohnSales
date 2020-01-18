var Enumeration = require("../lib/enumeration");
const debug = require("debug");
const log = debug("sales:controller:admin");
module.exports = (db, fileLoaderSvc, eventHandler) => {
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
    log("uploading %o", req.file.originalname);
    var message = "Thank You, we will have this done shortly";
    var funcError = null;

    //console.log(req.file);// contains files
    var processId = 0;
    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: "STARTED"
    });

    try {
      await process.query(
        "DELETE FROM FileProcess WHERE CreatedOn < ADDDATE( NOW(), INTERVAL 2 DAY);"
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
            OrderColumns.ORDERNET
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

  adminController.upload_order_items = async function (req, response) {
    log("uploading %o", req.file.originalname);
    var message = "Thank You, we will have this done shortly";
    var funcError = null;

    //console.log(req.file);// contains files
    var processId = 0;
    var process = new db.FileProcesses({
      FileName: req.file.originalname,
      ProcessStatus: "STARTED"
    });

    try {
      await process.query(
        "DELETE FROM FileProcess WHERE CreatedOn < ADDDATE( NOW(), INTERVAL 2 DAY);"
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
          loadDataSQL: "CALL LoadOrderItems(?)",
          convertToNumberIndexes: [
            OrderItemColumns.QUANTITY,
            OrderItemColumns.PRICE,
            OrderItemColumns.DISCOUNTAMOUNT,
            OrderItemColumns.SHIPPINGDISCOUNT,
            OrderItemColumns.ORDERSHIPPING,
            OrderItemColumns.ORDERSALESTAX,
            OrderItemColumns.ITEMTOTAL,
            OrderItemColumns.SHIPPINGDISCOUNT,
            OrderItemColumns.INPERSONDISCOUNT
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

  return adminController;
};

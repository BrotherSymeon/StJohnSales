DELIMITER $$

DROP PROCEDURE IF EXISTS package3 $$

CREATE PROCEDURE package3()
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
      SHOW ERRORS;
      ROLLBACK;
    END;





    SELECT "Dropping tempEtsyLising and EtsyListings table" as "INFO";
    DROP TABLE IF EXISTS tempEtsyListing;
    DROP TABLE IF EXISTS EtsyListing;

    SELECT "Creating tempEtsyListing table" as "INFO";
    CREATE TABLE tempEtsyListing (
      TITLE VARCHAR(500),
      DESCRIPTION TEXT,
      PRICE DECIMAL(6,2) DEFAULT 0.0,
      CURRENCY_CODE VARCHAR(10),
      QUANTITY INT(20),
      TAGS VARCHAR(500),
      MATERIALS VARCHAR(1000),
      IMAGE1 VARCHAR(500),
      IMAGE2 VARCHAR(500),
      IMAGE3 VARCHAR(500),
      IMAGE4 VARCHAR(500),
      IMAGE5 VARCHAR(500),
      IMAGE6 VARCHAR(500),
      IMAGE7 VARCHAR(500),
      IMAGE8 VARCHAR(500),
      IMAGE9 VARCHAR(500),
      IMAGE10 VARCHAR(500),
      VARIATION1TYPE VARCHAR(1000),
      VARIATION1NAME VARCHAR(1000),
      VARIATION1VALUES VARCHAR(1000),
      VARIATION2TYPE VARCHAR(1000),
      VARIATION2NAME VARCHAR(1000),
      VARIATION2VALUES VARCHAR(1000)
    );

    SELECT "Creating EtsyListing table" as "INFO";
    CREATE TABLE EtsyListing (
      ETSYLISTINGID BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      TITLE VARCHAR(500),
      LISTINGID INT(20),
      SKU VARCHAR(50),
      DESCRIPTION TEXT,
      PRICE DECIMAL(6,2) DEFAULT 0.0,
      CURRENCY_CODE VARCHAR(10),
      QUANTITY INT(20),
      TAGS VARCHAR(500),
      MATERIALS VARCHAR(1000),
      IMAGE1 VARCHAR(500),
      IMAGE2 VARCHAR(500),
      IMAGE3 VARCHAR(500),
      IMAGE4 VARCHAR(500),
      IMAGE5 VARCHAR(500),
      IMAGE6 VARCHAR(500),
      IMAGE7 VARCHAR(500),
      IMAGE8 VARCHAR(500),
      IMAGE9 VARCHAR(500),
      IMAGE10 VARCHAR(500),
      VARIATION1TYPE VARCHAR(1000),
      VARIATION1NAME VARCHAR(1000),
      VARIATION1VALUES VARCHAR(1000),
      VARIATION2TYPE VARCHAR(1000),
      VARIATION2NAME VARCHAR(1000),
      VARIATION2VALUES VARCHAR(1000),
      PRIMARY KEY (ETSYLISTINGID)
    );


    SELECT "Dropping tempEtsyDeposit and EtsyDeposit tables" as "INFO";
    DROP TABLE IF EXISTS tempEtsyDeposit;
    DROP TABLE IF EXISTS EtsyDeposit;

    SELECT "Creating tempEtsyDeposit table" as "INFO";
    CREATE TABLE tempEtsyDeposit (
      DepositDate VARCHAR(12),
      Amount DECIMAL(6,2) DEFAULT 0.0,
      Currency VARCHAR(10),
      Status VARCHAR(12),
      AccountEndingDigits INT(10)
    );

    SELECT "Creating EtsyDeposit table" as "INFO";
    CREATE TABLE EtsyDeposit (
      EtsyDepositId BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      DepositDate DATE,
      Amount DECIMAL(6,2) DEFAULT 0.0,
      Currency VARCHAR(10),
      Status VARCHAR(12),
      AccountEndingDigits INT(10),
      PRIMARY KEY (EtsyDepositId)
    );


    SELECT "Dropping FileProcess and FileProcessDetails tables" as "INFO";
    DROP TABLE IF EXISTS FileProcessDetails;
    DROP TABLE IF EXISTS FileProcess;

    SELECT "Creating FileProcess tables" as "INFO";
    CREATE TABLE FileProcess (
      FileId bigint(20) unsigned NOT NULL AUTO_INCREMENT,
      FileName varchar(100) NOT NULL,
      ProcessStatus enum('CREATED','STARTED','FINISHED','ERROR') DEFAULT NULL,
      CreatedOn timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (FileId)
    );


    SELECT "Creating FileProcessDetails tables" as "INFO";
    CREATE TABLE FileProcessDetails (
      FileProcessDetailId bigint(20) unsigned NOT NULL AUTO_INCREMENT,
      DetailType enum('MESSAGE','ERROR','WARNING') DEFAULT NULL,
      DetailMessage varchar(200) DEFAULT NULL,
      CreatedOn timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PercentDone int(11) DEFAULT '0',
      FileId bigint(20) unsigned NOT NULL,
      PRIMARY KEY (FileProcessDetailId),
      KEY fk_file (FileId),
      CONSTRAINT fk_file FOREIGN KEY (FileId)
        REFERENCES FileProcess (FileId)
        ON DELETE CASCADE
    );


    SELECT "DROPPING tempEtsyPayment table" as "INFO";
    DROP TABLE IF EXISTS tempEtsyPayment;
    SELECT "DROPPING EtsyPayment table" as "INFO";
    DROP TABLE IF EXISTS EtsyPayment;

    SELECT "Creating tempEtsyPayment table" as "INFO";
    CREATE TABLE tempEtsyPayment (
      PaymentID BIGINT(20) UNSIGNED NOT NULL,
      BuyerUsername VARCHAR(100),
      BuyerName VARCHAR(100),
      OrderID BIGINT(20) UNSIGNED,
      GrossAmount DECIMAL(6,2) DEFAULT 0.0,
      Fees DECIMAL(6,2) DEFAULT 0.0,
      NetAmount DECIMAL(6,2) DEFAULT 0.0,
      PostedGross DECIMAL(6,2) DEFAULT 0.0,
      PostedFees DECIMAL(6,2) DEFAULT 0.0,
      PostedNet DECIMAL(6,2) DEFAULT 0.0,
      AdjustedGross DECIMAL(6,2) DEFAULT 0.0,
      AdjustedFees DECIMAL(6,2) DEFAULT 0.0,
      AdjustedNet DECIMAL(6,2) DEFAULT 0.0,
      Currency VARCHAR(10),
      ListingAmount DECIMAL(6,2) DEFAULT 0.0,
      ListingCurrency VARCHAR(10),
      ExchangeRate DECIMAL(6,2) DEFAULT 0.0,
      VATAmount DECIMAL(6,2),
      GiftCardApplied VARCHAR(4),
      Status VARCHAR(20),
      FundsAvailable VARCHAR(12),
      OrderDate VARCHAR(12),
      Buyer VARCHAR(50),
      OrderType VARCHAR(50),
      PaymentType VARCHAR(50),
      RefundAmount DECIMAL(6,2) DEFAULT 0.0
    );

    SELECT "Creating EtsyPayment table" as "INFO";
    CREATE TABLE EtsyPayment(
      PaymentID BIGINT(20) UNSIGNED NOT NULL,
      BuyerUsername VARCHAR(100),
      BuyerName VARCHAR(100),
      OrderID BIGINT(20) UNSIGNED,
      GrossAmount DECIMAL(6,2) DEFAULT 0.0,
      Fees DECIMAL(6,2) DEFAULT 0.0,
      NetAmount DECIMAL(6,2) DEFAULT 0.0,
      PostedGross DECIMAL(6,2) DEFAULT 0.0,
      PostedFees DECIMAL(6,2) DEFAULT 0.0,
      PostedNet DECIMAL(6,2) DEFAULT 0.0,
      AdjustedGross DECIMAL(6,2) DEFAULT 0.0,
      AdjustedFees DECIMAL(6,2) DEFAULT 0.0,
      AdjustedNet DECIMAL(6,2) DEFAULT 0.0,
      Currency VARCHAR(10),
      ListingAmount DECIMAL(6,2) DEFAULT 0.0,
      ListingCurrency VARCHAR(10),
      ExchangeRate DECIMAL(6,2) DEFAULT 0.0,
      VATAmount DECIMAL(6,2),
      GiftCardApplied BIT(1),
      Status VARCHAR(20),
      FundsAvailable DATE,
      OrderDate DATE,
      Buyer VARCHAR(50),
      OrderType VARCHAR(50),
      PaymentType VARCHAR(50),
      RefundAmount DECIMAL(6,2) DEFAULT 0.0,
      UpdatedOn TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
      CreatedOn TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (PaymentID)
    );







    SELECT "Dropping Buyer table" as "INFO";
    DROP TABLE IF EXISTS Buyer;

    SELECT "Creating Buyer table" as "INFO";
    CREATE TABLE IF NOT EXISTS Buyer (
        BuyerId INT AUTO_INCREMENT PRIMARY KEY,
        BuyerUserId VARCHAR(200) ,
        FullName VARCHAR(200),
        FirstName VARCHAR(200),
        LastName VARCHAR(200),
        BuyerName VARCHAR(200),
        NewBuyerDate DATE
    );
    SELECT "Dropping ShipTo table" as "INFO";
    DROP TABLE IF EXISTS ShipTo;

    SELECT "Creating ShipTo table" as "INFO";
    CREATE TABLE IF NOT EXISTS ShipTo (
      ShipToId INT AUTO_INCREMENT PRIMARY KEY,
      BuyerId INT NOT NULL,
      Street1 VARCHAR(200),
      Street2 VARCHAR(200),
      ShipCity VARCHAR(200),
      ShipState VARCHAR(100),
      ShipZipCode VARCHAR(20),
      ShipCountry VARCHAR(100)
    );






    SELECT "Adding BuyerId to tempOrders table" as "INFO";
    IF NOT EXISTS ( SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'BuyerId'
        AND TABLE_NAME = 'tempOrders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE tempOrders ADD BuyerId INT;
    END IF;

    SELECT "Adding ShipToId to tempOrders table" as "INFO";
    IF NOT EXISTS ( SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'ShipToId'
        AND TABLE_NAME = 'tempOrders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE tempOrders ADD ShipToId INT;
    END IF;

    SELECT "Adding BuyerId to Orders table" as "INFO";
    IF NOT EXISTS ( SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'BuyerId'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders ADD BuyerId INT;
    END IF;

    SELECT "Dropping BuyerUserId to Orders table" as "INFO";
    IF EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'BuyerUserId'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders DROP COLUMN BuyerUserId;
    END IF;

    SELECT "Dropping FullName to Orders table" as "INFO";
    IF EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'FullName'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders DROP COLUMN FullName;
    END IF;

    SELECT "Dropping and creating SaleDate on Orders table" as "INFO";
    IF EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'SaleDate'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders DROP COLUMN SaleDate;
        ALTER TABLE Orders ADD COLUMN SaleDate DATE;
    END IF;

    SELECT "Dropping and creating DateShipped on Orders table" as "INFO";
    IF EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'DateShipped'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders DROP COLUMN DateShipped;
        ALTER TABLE Orders ADD COLUMN DateShipped DATE;
    END IF;

    SELECT "Dropping FirstName to Orders table" as "INFO";
    IF EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'FirstName'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders DROP COLUMN FirstName;
    END IF;


    SELECT "Dropping LastName to Orders table" as "INFO";
    IF EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'LastName'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders DROP COLUMN LastName;
    END IF;

    SELECT "Adding CreatedOn to Orders table" as "INFO";
    IF NOT EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'CreatedOn'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders ADD COLUMN CreatedOn TIMESTAMP DEFAULT NOW() ;
    END IF;

    SELECT "Adding UpdatedOn to Orders table" as "INFO";
    IF NOT EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'UpdatedOn'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders ADD COLUMN UpdatedOn TIMESTAMP DEFAULT NOW() ON UPDATE NOW();
    END IF;


    SELECT "Adding ShipToId to Orders table" as "INFO";
    IF NOT EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'ShipToId'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders ADD COLUMN ShipToId INT ;
    END IF;


    SELECT "Dropping Buyer to Orders table" as "INFO";
    IF EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'Buyer'
        AND TABLE_NAME = 'Orders'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE Orders DROP COLUMN Buyer ;
    END IF;

    SELECT "Adding CreatedOn to FileProcess table" as "INFO";
    IF NOT EXISTS (SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE COLUMN_NAME = 'CreatedOn'
      AND TABLE_NAME = 'FileProcess'
      AND TABLE_SCHEMA = 'sales')
    THEN
      ALTER TABLE FileProcess ADD CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

   # -------------------------------------------------------------------
   # --------------          ORDERITEMS          -----------------------
   # -------------------------------------------------------------------

    SELECT "Adding CreatedOn to OrderItems table" as "INFO";
    IF NOT EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'CreatedOn'
        AND TABLE_NAME = 'OrderItems'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE OrderItems ADD COLUMN CreatedOn TIMESTAMP DEFAULT NOW() ;
    END IF;

    SELECT "Adding UpdatedOn to OrderItems table" as "INFO";
    IF NOT EXISTS (SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE COLUMN_NAME = 'UpdatedOn'
        AND TABLE_NAME = 'OrderItems'
        AND TABLE_SCHEMA = 'sales')
    THEN
        ALTER TABLE OrderItems ADD COLUMN UpdatedOn TIMESTAMP DEFAULT NOW() ON UPDATE NOW();
    END IF;


    SELECT "Droppin OrderDetail view " as "INFO";
    DROP VIEW IF EXISTS OrderDetail;

    SELECT "Creating OrderDetail VIEW" as "INFO";
    CREATE VIEW OrderDetail AS
    SELECT OrderId,
    SoldThrough,
    NumberOfItems,
    PaymentMethod,
    Currency,
    OrderValue,
    CouponCode,
    CouponDetails,
    DiscountAmount,
    ShippingDiscount,
    Shipping,
    SalesTax,
    OrderTotal,
    Status,
    CardProcessingFees,
    OrderNet,
    AdjustedOrderTotal,
    AdjustedCardProcessingFees,
    AdjustedNetOrderAmount,
    OrderType,
    PaymentType,
    InPersonDiscount,
    InPersonLocation,
    o.BuyerId,
    o.ShipToId,
    CreatedOn,
    UpdatedOn,
    SaleDate,
    DateShipped,
    s.Street1,
    s.Street2,
    s.ShipCity,
    s.ShipState,
    s.ShipZipCode,
    s.ShipCountry,
    BuyerUserId,
    b.FullName,
    b.FirstName,
    b.LastName,
    b.BuyerName,
    NewBuyerDate
    FROM Orders o
    LEFT JOIN
    ShipTo s ON s.ShipToId = o.ShipToId
    LEFT JOIN
    Buyer b ON b.BuyerId = o.BuyerId;



    SELECT "Droppin BuyerOrders view " as "INFO";
    DROP VIEW IF EXISTS BuyerOrders;

    SELECT "Creating BuyerOrders VIEW" as "INFO";
    CREATE VIEW BuyerOrders
    AS
    SELECT
    SaleDate,
    DateShipped,
    OrderId,
    OrderValue,
    OrderTotal,
    Status,
    FullName
    FROM Orders
    INNER JOIN
    Buyer USING (BuyerId)
    ORDER BY SaleDate DESC;



END$$

CALL package3()$$

DROP PROCEDURE IF EXISTS package3 $$

DELIMITER ;


DELIMITER //
DROP PROCEDURE IF EXISTS LoadEtsyListings //
CREATE PROCEDURE LoadEtsyListings()
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN

    DECLARE exit handler for sqlexception
    BEGIN
      SHOW ERRORS;
      ROLLBACK;
    END;

    DECLARE exit handler for sqlwarning
    BEGIN
      ROLLBACK;
    END;

    START TRANSACTION;


    INSERT INTO EtsyListing (
      TITLE,
      DESCRIPTION,
      PRICE,
      CURRENCY_CODE,
      QUANTITY,
      TAGS,
      MATERIALS,
      IMAGE1,
      IMAGE2,
      IMAGE3,
      IMAGE4,
      IMAGE5,
      IMAGE6,
      IMAGE7,
      IMAGE8,
      IMAGE9,
      IMAGE10,
      VARIATION1TYPE,
      VARIATION1NAME,
      VARIATION1VALUES,
      VARIATION2TYPE,
      VARIATION2NAME,
      VARIATION2VALUES
    ) SELECT
      t.TITLE,
      t.DESCRIPTION,
      t.PRICE,
      t.CURRENCY_CODE,
      t.QUANTITY,
      t.TAGS,
      t.MATERIALS,
      t.IMAGE1,
      t.IMAGE2,
      t.IMAGE3,
      t.IMAGE4,
      t.IMAGE5,
      t.IMAGE6,
      t.IMAGE7,
      t.IMAGE8,
      t.IMAGE9,
      t.IMAGE10,
      t.VARIATION1TYPE,
      t.VARIATION1NAME,
      t.VARIATION1VALUES,
      t.VARIATION2TYPE,
      t.VARIATION2NAME,
      t.VARIATION2VALUES
      FROM tempEtsyListing t
      WHERE NOT EXISTS
        ( SELECT 1
          FROM EtsyListing e
          WHERE e.TITLE = t.TITLE OR
          e.DESCRIPTION = t.DESCRIPTION OR
          e.PRICE = t.PRICE
        );

    COMMIT;

END //
DELIMITER ;



DELIMITER //
DROP PROCEDURE IF EXISTS LoadEtsyDeposits //
CREATE PROCEDURE LoadEtsyDeposits()
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN

    DECLARE exit handler for sqlexception
    BEGIN
      SHOW ERRORS;
      ROLLBACK;
    END;

    DECLARE exit handler for sqlwarning
    BEGIN
      ROLLBACK;
    END;

    START TRANSACTION;


    INSERT INTO EtsyDeposit (
      DepositDate,
      Amount,
      Currency,
      Status,
      AccountEndingDigits
    ) SELECT
      DATE(t.DepositDate) as DepositDate,
      t.Amount,
      t.Currency,
      t.Status,
      t.AccountEndingDigits
      FROM tempEtsyDeposit t
      WHERE NOT EXISTS
        ( SELECT 1
          FROM EtsyDeposit e
          WHERE e.Amount = t.Amount AND
          e.Currency = t.Currency AND
          e.Status = t.Status AND
          e.DepositDate = DATE(t.DepositDate)
        );

    COMMIT;

END //
DELIMITER ;



DELIMITER //
DROP PROCEDURE IF EXIStS LoadEtsyPayments //
CREATE PROCEDURE LoadEtsyPayments()
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN

    DECLARE exit handler for sqlexception
    BEGIN
      SHOW ERRORS;
      ROLLBACK;
    END;

    DECLARE exit handler for sqlwarning
    BEGIN
      ROLLBACK;
    END;

    START TRANSACTION;


    INSERT INTO EtsyPayment(
      PaymentID ,
      BuyerUsername,
      BuyerName,
      OrderID ,
      GrossAmount ,
      Fees ,
      NetAmount ,
      PostedGross ,
      PostedFees ,
      PostedNet ,
      AdjustedGross ,
      AdjustedFees ,
      AdjustedNet ,
      Currency,
      ListingAmount ,
      ListingCurrency,
      ExchangeRate ,
      VATAmount,
      GiftCardApplied,
      Status,
      FundsAvailable ,
      OrderDate ,
      Buyer,
      OrderType ,
      PaymentType ,
      RefundAmount
    ) SELECT
      t.PaymentID ,
      t.BuyerUsername,
      t.BuyerName,
      t.OrderID ,
      t.GrossAmount ,
      t.Fees ,
      t.NetAmount ,
      t.PostedGross ,
      t.PostedFees ,
      t.PostedNet ,
      t.AdjustedGross ,
      t.AdjustedFees ,
      t.AdjustedNet ,
      t.Currency,
      t.ListingAmount ,
      t.ListingCurrency,
      t.ExchangeRate ,
      t.VATAmount,
      IF(t.GiftCardApplied = 'No', 0, 1) as GiftCardApplied,
      t.Status,
      DATE(
        CONCAT( MID(t.FundsAvailable, 9, 2),
          '-',
          MID(t.FundsAvailable, 1, 2),
          '-',
          MID(t.FundsAvailable, 4, 2)
        )
      ) as FundsAvailable,
      DATE(
        CONCAT( MID(t.OrderDate, 9, 2),
          '-',
          MID(t.OrderDate, 1, 2),
          '-',
          MID(t.OrderDate, 4, 2)
        )
      ) as OrderDate,
      t.Buyer,
      t.OrderType ,
      t.PaymentType ,
      t.RefundAmount
      FROM tempEtsyPayment t
      WHERE NOT EXISTS
        ( SELECT 1
          FROM EtsyPayment e
          WHERE e.PaymentID = t.PaymentID
        );




    COMMIT;


END //
DELIMITER ;








DELIMITER //
DROP PROCEDURE IF EXIStS LoadOrderItems //
CREATE PROCEDURE LoadOrderItems()
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN

    DECLARE exit handler for sqlexception
    BEGIN
      SHOW ERRORS;
      ROLLBACK;
    END;

    DECLARE exit handler for sqlwarning
    BEGIN
      ROLLBACK;
    END;

    START TRANSACTION;


    INSERT INTO OrderItems(
      SaleDate,
      ItemName,
      Buyer,
      Quantity,
      Price,
      CouponCode,
      CouponDetails,
      DiscountAmount,
      ShippingDiscount,
      OrderShipping,
      OrderSalesTax,
      ItemTotal,
      Currency,
      TransactionID,
      ListingID,
      DatePaid,
      DateShipped,
      ShipName,
      ShipAddress1,
      ShipAddress2,
      ShipCity,
      ShipState,
      ShipZipcode,
      ShipCountry,
      OrderID,
      Variations,
      OrderType,
      ListingsType,
      PaymentType,
      InPersonDiscount,
      InPersonLocation,
      VATPaidbyBuyer
    ) SELECT
      DATE(
        CONCAT( MID( t.SaleDate, 7, 2),
          '-',
          MID( t.SaleDate, 1, 2),
          '-',
          MID( t.SaleDate, 4, 2)
        )
      ) as SaleDate,
      t.ItemName,
      t.Buyer,
      t.Quantity,
      t.Price,
      t.CouponCode,
      t.CouponDetails,
      t.DiscountAmount,
      t.ShippingDiscount,
      t.OrderShipping,
      t.OrderSalesTax,
      t.ItemTotal,
      t.Currency,
      t.TransactionID,
      t.ListingID,
      DATE(
        CONCAT( MID(t.DatePaid, 9, 2),
          '-',
          MID(t.DatePaid, 1, 2),
          '-',
          MID(t.DatePaid, 4, 2)
        )
      ) as DatePaid,
      IF(t.DateShipped = '', DATE('9999-12-31'), DATE(
        CONCAT( MID(t.DateShipped, 9, 2),
          '-',
          MID(t.DateShipped, 1, 2),
          '-',
          MID(t.DateShipped, 4, 2)
        )
      )) as DateShipped,
      t.ShipName,
      t.ShipAddress1,
      t.ShipAddress2,
      t.ShipCity,
      t.ShipState,
      t.ShipZipcode,
      t.ShipCountry,
      t.OrderID,
      t.Variations,
      t.OrderType,
      t.ListingsType,
      t.PaymentType,
      t.InPersonDiscount,
      t.InPersonLocation,
      t.VATPaidbyBuyer
      FROM tempOrderItems t
      WHERE NOT EXISTS
        ( SELECT 1
          FROM OrderItems o
          WHERE o.TransactionID = t.TransactionID
        );


      UPDATE OrderItems o
      INNER JOIN tempOrderItems t ON t.TransactionID = o.TransactionID
      SET o.DatePaid = DATE(
        CONCAT( MID(t.DatePaid, 9, 2),
          '-',
          MID(t.DatePaid, 1, 2),
          '-',
          MID(t.DatePaid, 4, 2)
        )
      ) ,
      o.DateShipped = IF(t.DateShipped = '', DATE('9999-12-31'), DATE(
        CONCAT( MID(t.DateShipped, 9, 2),
          '-',
          MID(t.DateShipped, 1, 2),
          '-',
          MID(t.DateShipped, 4, 2)
        )
      ));


    COMMIT;


END //
DELIMITER ;

DELIMITER //



DROP PROCEDURE IF EXISTS LoadOrders //
CREATE PROCEDURE LoadOrders(IN procID BIGINT UNSIGNED)
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
BEGIN
    DECLARE myRowCount int default 0;
    DECLARE exit handler for sqlexception
    BEGIN
      SHOW ERRORS;
      ROLLBACK;
    END;

    DECLARE exit handler for sqlwarning
    BEGIN
      ROLLBACK;
    END;

    START TRANSACTION;


    INSERT INTO Buyer(
        BuyerUserId ,
        FullName,
        FirstName,
        LastName,
        BuyerName
        )
    SELECT
        t.BuyerUserId ,
        t.FullName,
        t.FirstName,
        t.LastName,
        t.Buyer
    FROM tempOrders t
    WHERE t.Buyer != 'ryoung+ipp@etsy.com'
    AND NOT EXISTS (
        SELECT 1 FROM Buyer b
        WHERE t.BuyerUserId = b.BuyerUserId
        AND t.Buyer = b.BuyerName
        );

    SELECT row_count() INTO myRowCount;
    SELECT myRowCount as BuyerInsert;


    UPDATE tempOrders t, Buyer b SET
    t.BuyerId = b.BuyerId
    WHERE b.BuyerUserId = t.BuyerUserId AND b.BuyerName = t.Buyer;


    INSERT INTO ShipTo (
      BuyerId,
      Street1,
      Street2,
      ShipCity,
      ShipState,
      ShipZipCode,
      ShipCountry
    ) SELECT DISTINCT
      t.BuyerId,
      t.Street1,
      t.Street2,
      t.ShipCity,
      t.ShipState,
      t.ShipZipCode,
      t.ShipCountry
    FROM tempOrders t
    WHERE t.Buyer != 'ryoung+ipp@etsy.com' AND
    NOT EXISTS (
      SELECT 1
      FROM ShipTo s
      WHERE s.BuyerId = t.BuyerId AND
      s.Street1 = t.Street1 AND
      s.Street2 = t.Street2 AND
      s.ShipCity = t.ShipCity AND
      s.ShipState = t.ShipState AND
      s.ShipZipCode = t.ShipZipCode AND
      s.ShipCountry = t.ShipCountry
    );

    UPDATE tempOrders t, ShipTo s SET
      t.ShipToId = s.ShipToId
    WHERE t.Buyer != 'ryoung+ipp@etsy.com' AND
      s.BuyerId = t.BuyerId AND
      s.Street1 = t.Street1 AND
      s.Street2 = t.Street2 AND
      s.ShipCity = t.ShipCity AND
      s.ShipState = t.ShipState AND
      s.ShipZipCode = t.ShipZipCode AND
      s.ShipCountry = t.ShipCountry;

    INSERT INTO Orders (
        SaleDate,
        OrderId,
        DayOfYear,
        MonthOfYear,
        QuarterOfYear,
        SaleYear,
        SoldThrough ,
        NumberOfItems,
        PaymentMethod ,
        DateShipped,
        Street1 ,
        Street2 ,
        ShipCity ,
        ShipState ,
        ShipZipCode ,
        ShipCountry ,
        Currency ,
        OrderValue ,
        CouponCode ,
        CouponDetails ,
        DiscountAmount,
        ShippingDiscount,
        Shipping,
        SalesTax,
        OrderTotal,
        Status,
        CardProcessingFees,
        OrderNet,
        AdjustedOrderTotal,
        AdjustedCardProcessingFees,
        AdjustedNetOrderAmount,
        OrderType ,
        PaymentType ,
        InPersonDiscount ,
        InPersonLocation ,
        BuyerId,
        ShipToId
      ) select
        DATE(
          CONCAT( MID(t.SaleDate, 7, 2),
            '-',
            MID(t.SaleDate, 1, 2),
            '-',
            MID(t.SaleDate, 4, 2)
          )
        ) as SaleDate,
        t.OrderId,
        DAYOFYEAR(DATE(
          CONCAT(
            CONCAT('20', MID(t.SaleDate, 7, 2)),
            '-',
            MID(t.SaleDate, 1, 2),
            '-',
            MID(t.SaleDate, 4, 2)
            )
          )) as DayOfYear,
        MID(t.SaleDate, 1, 2) as SaleMonth,
          FiscalYearStartDate( DATE(
          CONCAT(
            CONCAT('20', MID(t.SaleDate, 7, 2)),
            '-',
            MID(t.SaleDate, 1, 2),
            '-',
            MID(t.SaleDate, 4, 2)
            )
          )) as Quarter,
          CONCAT('20', MID(t.SaleDate, 7, 2)),
          IF(t.PaymentMethod = 'Other', 'SQUARE','ETSY'),
        t.NumberOfItems,
        t.PaymentMethod ,
        IF(t.DateShipped = '', DATE('9999-12-31'), DATE(
          CONCAT( MID(t.DateShipped, 7, 2),
            '-',
            MID(t.DateShipped, 1, 2),
            '-',
            MID(t.DateShipped, 4, 2)
          )
        )) as DateShipped,
        t.Street1 ,
        t.Street2 ,
        t.ShipCity ,
        t.ShipState ,
        t.ShipZipCode ,
        t.ShipCountry ,
        t.Currency ,
        t.OrderValue ,
        t.CouponCode ,
        t.CouponDetails ,
        t.DiscountAmount,
        t.ShippingDiscount,
        t.Shipping,
        t.SalesTax,
        t.OrderTotal,
        t.Status,
        t.CardProcessingFees,
        t.OrderNet,
        t.AdjustedOrderTotal,
        t.AdjustedCardProcessingFees,
        t.AdjustedNetOrderAmount,
        t.OrderType ,
        t.PaymentType ,
        t.InPersonDiscount ,
        t.InPersonLocation ,
        t.BuyerId,
        t.ShipToId
        FROM tempOrders t
        WHERE NOT EXISTS
          (SELECT 1
          FROM Orders o
          WHERE o.OrderId = t.OrderId);


        UPDATE Orders t1
        INNER JOIN tempOrders t2 ON t1.OrderId = t2.OrderId
        SET t1.DateShipped = IF(t2.DateShipped = '', DATE('9999-12-31'), DATE(
          CONCAT( MID(t2.DateShipped, 7, 2),
            '-',
            MID(t2.DateShipped, 1, 2),
            '-',
            MID(t2.DateShipped, 4, 2)
          )
        ))
        WHERE t2.DateShipped != '';


        UPDATE Buyer b
        JOIN ( SELECT BuyerId, MIN(SaleDate) as minDate FROM Orders GROUP BY BuyerId) bs
        ON bs.BuyerId = b.BuyerId
        SET b.NewBuyerDate = bs.minDate;


        COMMIT;

END //

DELIMITER ;



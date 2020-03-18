


DROP TABLE IF EXISTS tempOrders;
create TABLE tempOrders (
  SaleDate VARCHAR(8) NOT NULL,
  OrderId INT UNSIGNED NOT NULL,
  PRIMARY KEY (OrderId),
  BuyerUserId VARCHAR(100),
  FullName VARCHAR(50),
  FirstName VARCHAR(50),
  LastName VARCHAR(50),
  NumberOfItems INT UNSIGNED,
  PaymentMethod VARCHAR(20),
  DateShipped VARCHAR(8),
  Street1 VARCHAR(50),
  Street2 VARCHAR(50),
  ShipCity VARCHAR(50),
  ShipState VARCHAR(50),
  ShipZipCode VARCHAR(20),
  ShipCountry VARCHAR(20),
  Currency VARCHAR(10),
  OrderValue DECIMAL(6,2) DEFAULT 0.0,
  CouponCode VARCHAR(150),
  CouponDetails VARCHAR(150),
  DiscountAmount DECIMAL(6,2) DEFAULT 0.0,
  ShippingDiscount DECIMAL(6,2) DEFAULT 0.0,
  Shipping DECIMAL(6,2) DEFAULT 0.0,
  SalesTax DECIMAL(6,2) DEFAULT 0.0,
  OrderTotal DECIMAL(6,2) DEFAULT 0.0,
  Status VARCHAR(20),
  CardProcessingFees DECIMAL(6,2) DEFAULT 0.0,
  OrderNet DECIMAL(6,2) DEFAULT 0.0,
  AdjustedOrderTotal DECIMAL(6,2) DEFAULT 0.00 NULL,
  AdjustedCardProcessingFees DECIMAL(6,2) DEFAULT 0.0,
  AdjustedNetOrderAmount DECIMAL(6,2) DEFAULT 0.0,
  Buyer VARCHAR(50),
  OrderType VARCHAR(50),
  PaymentType VARCHAR(50),
  InPersonDiscount DECIMAL(6,2) DEFAULT 0.0,
  InPersonLocation VARCHAR(50)
);


DROP TABLE IF EXISTS tempOrderItems;
create TABLE tempOrderItems (
  SaleDate DATE NOT NULL,
  OrderId INT UNSIGNED NOT NULL,
  ListingId INT UNSIGNED NOT NULL,
  Buyer VARCHAR(120),
  Quantity INT ,
  Price  DECIMAL(6,2) DEFAULT 0.0,
  CouponCode VARCHAR(120),
  CouponDetails VARCHAR(200),
  DiscountAmount  DECIMAL(6,2) DEFAULT 0.0,
  ShippingDiscount  DECIMAL(6,2) DEFAULT 0.0,
  OrderShipping  DECIMAL(6,2) DEFAULT 0.0,
  OrderSalesTax  DECIMAL(6,2) DEFAULT 0.0,
  ItemTotal  DECIMAL(6,2) DEFAULT 0.0,
  Currency VARCHAR(10),
  TransactionId INT UNSIGNED,
  DatePaid DATE,
  DateShipped DATE,
  ShipName VARCHAR(200),
  ShipAddress1 VARCHAR(200),
  ShipAddress2 VARCHAR(200),
  ShipCity VARCHAR(100),
  ShipState VARCHAR(100),
  ShipZipCode VARCHAR(100),
  ShipCountry VARCHAR(100),
  Variations VARCHAR(200),
  OrderType VARCHAR(100),
  ListingsType VARCHAR(100),
  PaymentType VARCHAR(100),
  InPersonDiscount  DECIMAL(6,2) DEFAULT 0.0,
  InPersonLocation VARCHAR(200),
  VATPaidByBuyer BIT
);




DROP TABLE IF EXISTS Orders;
create TABLE Orders (
  OrderId INT UNSIGNED NOT NULL,
  PRIMARY KEY (OrderId),
  SaleDate VARCHAR(8) NOT NULL,
  DayOfYear INT NOT NULL, 
  MonthOfYear VARCHAR(7) NOT NULL, 
  QuarterOfYear VARCHAR(7) NOT NULL, 
  SaleYear INT NOT NULL,
  SoldThrough VARCHAR(20) NOT NULL,
  BuyerUserId VARCHAR(100),
  FullName VARCHAR(50),
  FirstName VARCHAR(50),
  LastName VARCHAR(50),
  NumberOfItems INT UNSIGNED,
  PaymentMethod VARCHAR(20),
  DateShipped VARCHAR(8),
  Street1 VARCHAR(50),
  Street2 VARCHAR(50),
  ShipCity VARCHAR(50),
  ShipState VARCHAR(50),
  ShipZipCode VARCHAR(20),
  ShipCountry VARCHAR(20),
  Currency VARCHAR(10),
  OrderValue DECIMAL(6,2) DEFAULT 0.0,
  CouponCode VARCHAR(150),
  CouponDetails VARCHAR(150),
  DiscountAmount DECIMAL(6,2) DEFAULT 0.0,
  ShippingDiscount DECIMAL(6,2) DEFAULT 0.0,
  Shipping DECIMAL(6,2) DEFAULT 0.0,
  SalesTax DECIMAL(6,2) DEFAULT 0.0,
  OrderTotal DECIMAL(6,2) DEFAULT 0.0,
  Status VARCHAR(20),
  CardProcessingFees DECIMAL(6,2) DEFAULT 0.0,
  OrderNet DECIMAL(6,2) DEFAULT 0.0,
  AdjustedOrderTotal DECIMAL(6,2) DEFAULT 0.00,
  AdjustedCardProcessingFees DECIMAL(6,2) DEFAULT 0.0,
  AdjustedNetOrderAmount DECIMAL(6,2) DEFAULT 0.0,
  Buyer VARCHAR(50),
  OrderType VARCHAR(50),
  PaymentType VARCHAR(50),
  InPersonDiscount DECIMAL(6,2) DEFAULT 0.0,
  InPersonLocation VARCHAR(50)
);



DROP TABLE IF EXISTS OrderItems;
create TABLE OrderItems (
  SaleDate DATE NOT NULL,
  OrderId INT UNSIGNED NOT NULL,
  ListingId INT UNSIGNED NOT NULL,
  Buyer VARCHAR(120),
  Quantity INT ,
  Price  DECIMAL(6,2) DEFAULT 0.0,
  CouponCode VARCHAR(120),
  CouponDetails VARCHAR(200),
  DiscountAmount  DECIMAL(6,2) DEFAULT 0.0,
  ShippingDiscount  DECIMAL(6,2) DEFAULT 0.0,
  OrderShipping  DECIMAL(6,2) DEFAULT 0.0,
  OrderSalesTax  DECIMAL(6,2) DEFAULT 0.0,
  ItemTotal  DECIMAL(6,2) DEFAULT 0.0,
  Currency VARCHAR(10),
  TransactionId INT UNSIGNED,
  DatePaid DATE,
  DateShipped DATE,
  ShipName VARCHAR(200),
  ShipAddress1 VARCHAR(200),
  ShipAddress2 VARCHAR(200),
  ShipCity VARCHAR(100),
  ShipState VARCHAR(100),
  ShipZipCode VARCHAR(100),
  ShipCountry VARCHAR(100),
  Variations VARCHAR(200),
  OrderType VARCHAR(100),
  ListingsType VARCHAR(100),
  PaymentType VARCHAR(100),
  InPersonDiscount  DECIMAL(6,2) DEFAULT 0.0,
  InPersonLocation VARCHAR(200),
  VATPaidByBuyer BIT
);


DELETE FROM FileProcessDetails;
DELETE FROM FileProcess;


DROP TABLE IF EXISTS FileProcessDetails;
DROP TABLE IF EXISTS FileProcess;

create TABLE FileProcess (
  FileId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (FileId),
  FileName VARCHAR(100) NOT NULL,
  ProcessStatus ENUM('CREATED', 'STARTED', 'FINISHED', 'ERROR')
);


create  TABLE FileProcessDetails(
  FileProcessDetailId BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (FileProcessDetailId),
  DetailType ENUM('MESSAGE', 'ERROR', 'WARNING'),
  DetailMessage VARCHAR(200),
  CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  PercentDone INT DEFAULT 0,
  FileId BIGINT UNSIGNED NOT NULL,
  CONSTRAINT fk_file
  FOREIGN KEY (FileId)
    REFERENCES FileProcess(FileId)
);

DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(250),
    description TEXT,
    isAdmin BIT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email)
);

DROP TABLE IF EXISTS CanRegister;
CREATE TABLE IF NOT EXISTS CanRegister (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);








DROP FUNCTION IF EXISTS FiscalYearStartDate;
DELIMITER $$
CREATE FUNCTION `FiscalYearStartDate`(
  thisDate DATE
) RETURNS VARCHAR(7)
    DETERMINISTIC
BEGIN
  set @thisyear = YEAR(thisDate);
  set @beginingForYear = DATE( CONCAT(@thisyear, '-', '09', '-', '01') );
  IF @beginingForYear > thisDate THEN
    set @thisyear = @thisyear - 1;
    set @beginingForYear = DATE( CONCAT(@thisyear, '-', '09', '-', '01') );
  END IF;
  set @quarter = timestampdiff(month, @beginingForYear, thisDate) div 3 + 1;
  RETURN (CONCAT('Q', @quarter, '-', (@thisYear + 1)));
END$$
DELIMITER ;
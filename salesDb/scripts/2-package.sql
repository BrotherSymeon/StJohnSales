
DROP TABLE IF EXISTS tempOrderItems;
CREATE TABLE IF NOT EXISTS tempOrderItems(
  SaleDate VARCHAR(10),
  ItemName TEXT,
  Buyer VARCHAR(200),
  Quantity DECIMAL(6,2) DEFAULT 0.0,
  Price DECIMAL(6,2) DEFAULT 0.0,
  CouponCode VARCHAR(150),
  CouponDetails VARCHAR(150),
  DiscountAmount DECIMAL(6,2) DEFAULT 0.0,
  ShippingDiscount DECIMAL(6,2) DEFAULT 0.0,
  OrderShipping DECIMAL(6,2) DEFAULT 0.0,
  OrderSalesTax DECIMAL(6,2) DEFAULT 0.0,
  ItemTotal DECIMAL(6,2) DEFAULT 0.0,
  Currency  VARCHAR(20),
  TransactionID BIGINT,
  ListingID BIGINT,
  DatePaid VARCHAR(10),
  DateShipped VARCHAR(10),
  ShipName VARCHAR(250),
  ShipAddress1 VARCHAR(250),
  ShipAddress2 VARCHAR(250),
  ShipCity VARCHAR(250),
  ShipState VARCHAR(250),
  ShipZipcode VARCHAR(50),
  ShipCountry VARCHAR(100),
  OrderID BIGINT,
  Variations VARCHAR(250),
  OrderType VARCHAR(250),
  ListingsType VARCHAR(250),
  PaymentType VARCHAR(100),
  InPersonDiscount DECIMAL(6,2) DEFAULT 0.0,
  InPersonLocation VARCHAR(100),
  VATPaidbyBuyer BIT
);



DROP TABLE IF EXISTS OrderItems;
CREATE TABLE IF NOT EXISTS OrderItems(
  OrderItemId BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (OrderItemId),
  SaleDate DATE,
  ItemName TEXT,
  Buyer VARCHAR(200),
  Quantity DECIMAL(6,2) DEFAULT 0.0,
  Price DECIMAL(6,2) DEFAULT 0.0,
  CouponCode VARCHAR(150),
  CouponDetails VARCHAR(150),
  DiscountAmount DECIMAL(6,2) DEFAULT 0.0,
  ShippingDiscount DECIMAL(6,2) DEFAULT 0.0,
  OrderShipping DECIMAL(6,2) DEFAULT 0.0,
  OrderSalesTax DECIMAL(6,2) DEFAULT 0.0,
  ItemTotal DECIMAL(6,2) DEFAULT 0.0,
  Currency VARCHAR(20),
  TransactionID BIGINT,
  ListingID BIGINT,
  DatePaid Date,
  DateShipped DATE,
  ShipName VARCHAR(250),
  ShipAddress1 VARCHAR(250),
  ShipAddress2 VARCHAR(250),
  ShipCity VARCHAR(250),
  ShipState VARCHAR(250),
  ShipZipcode VARCHAR(50),
  ShipCountry VARCHAR(100),
  OrderID BIGINT NOT NULL,
  Variations VARCHAR(250),
  OrderType VARCHAR(250),
  ListingsType VARCHAR(250),
  PaymentType VARCHAR(100),
  InPersonDiscount DECIMAL(6,2) DEFAULT 0.0,
  InPersonLocation VARCHAR(100),
  VATPaidbyBuyer BIT,
  FOREIGN KEY (OrderID)
        REFERENCES Orders (OrderID)
        ON UPDATE RESTRICT ON DELETE CASCADE
);


CREATE INDEX IDX_OrderItems_OrderId ON OrderItems ( OrderID);
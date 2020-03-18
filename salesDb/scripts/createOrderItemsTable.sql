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



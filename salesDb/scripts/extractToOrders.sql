
INSERT INTO Orders (
  SaleDate,
  OrderId,
  DayOfYear, 
  MonthOfYear, 
  QuarterOfYear, 
  SaleYear,
  SoldThrough ,
  BuyerUserId ,
  FullName,
  FirstName ,
  LastName ,
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
  Buyer ,
  OrderType ,
  PaymentType ,
  InPersonDiscount ,
  InPersonLocation 
) select
  SaleDate,
  OrderId,
  DAYOFYEAR(DATE( 
    CONCAT( 
      CONCAT('20', MID(SaleDate, 7, 2)), 
      '-', 
      MID(SaleDate, 1, 2),
      '-', 
      MID(SaleDate, 4, 2) 
      ) 
    )) as DayOfYear,
  MID(SaleDate, 1, 2) as SaleMonth,  
    FiscalYearStartDate( DATE( 
    CONCAT( 
      CONCAT('20', MID(SaleDate, 7, 2)), 
      '-', 
      MID(SaleDate, 1, 2),
      '-', 
      MID(SaleDate, 4, 2) 
      ) 
    )) as Quarter,
    CONCAT('20', MID(SaleDate, 7, 2)),
    IF(PaymentMethod = 'Other', 'SQUARE','ETSY'),
     BuyerUserId ,
  FullName,
  FirstName ,
  LastName ,
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
  Buyer ,
  OrderType ,
  PaymentType ,
  InPersonDiscount ,
  InPersonLocation 
  FROM tempOrders t 
  WHERE NOT EXISTS
    (SELECT 1
     FROM Orders o
     WHERE o.OrderId = t.OrderId);

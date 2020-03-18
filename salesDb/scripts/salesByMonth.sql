
use sales;
SELECT 
  MonthOfYear,

  SUM(OrderTotal) as NetAmount
  FROM Orders
  GROUP BY MonthOfYear;



--You can use a combination of TIMESTAMPDIFF and integer division:
--October 1, 2018
set @FiscalYearStartDate = '2017-05-01';
set @today = '2017-09-14';

select timestampdiff(month, @FiscalYearStartDate, @today) div 3 + 1;
--http://rextester.com/HVBIE10213

--To get all rows from a table with dates that are in the same quarter as today:

select *
from myTable t
where timestampdiff(month, '2017-05-01', curdate()) div 3 = timestampdiff(month, '2017-05-01', t.date) div 3
--http://rextester.com/TLHD65717

--If you want to use an index you will need a more complex solution:

select *
from myTable t
where t.date >= '2017-05-01' + interval timestampdiff(month, '2017-05-01', curdate()) div 3 * 3 month
  and t.date <  '2017-05-01' + interval timestampdiff(month, '2017-05-01', curdate())

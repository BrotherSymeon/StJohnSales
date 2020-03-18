
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
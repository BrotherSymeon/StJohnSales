CREATE DATABASE IF NOT EXISTS sales;

CREATE USER IF NOT EXISTS 'salesAdmin'@'%' IDENTIFIED BY 'whiteponyrecord';
CREATE USER IF NOT EXISTS 'salesApp'@'%' IDENTIFIED BY 'whiteponyrecord';


GRANT ALL ON sales.* TO 'salesAdmin'@'%';
GRANT EXECUTE, INSERT, SELECT, UPDATE, DELETE ON sales.* TO 'salesApp'@'%';
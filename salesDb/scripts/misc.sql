LOAD DATA INFILE '/tmp/test.txt' INTO TABLE test IGNORE 1 LINES;

--gets te=he expiration date of the session
select FROM_UNIXTIME(expires) from sessions;
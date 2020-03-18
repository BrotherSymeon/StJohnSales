# Back up From the Command Line with mysqldump
The mysqldump client utility can dump a database including the SQL statements required to rebuild the database.

By default, the dump file includes the SQL commands to restore the tables and data.

To backup your MySQL database, the general syntax is:

sudo mysqldump -u [user] -p [database_name] > [filename].sql
Replace [user] with your username and password (if needed).
The [database_name] is the path and filename of the database.
The > command specifies the output.
[filename] is the path and filename you want to save the dump file as.
Other examples:

### To backup of an entire Database Management System:

mysqldump --all-databases --single-transaction --quick --lock-tables=false > full-backup-$(date +%F).sql -u root -p
### To include more than one database in the backup dump file:

sudo mysqldump -u [user] -p [database_1] [database_2] [database_etc] > [filename].sql
## How to Restore MySQL with mysqldump
Step 1: Create new database
On the system that hosts the database, use MySQL to create a new database.

Make sure you’ve named it the same as the database you lost. This creates the foundation file that mysqldump will import the data into. Since the dump file has the commands to rebuild the database, you only need to create the empty database.

Step 2: Restore MySQL Dump
To restore a MySQL backup, enter:

mysql -u [user] -p [database_name] < [filename].sql
Make sure to include [databse_name] and [filename] in the path.

It’s likely that on the host machine, [database_name] can be in a root directory, so you may not need to add the path. Make sure that you specify the exact path for the dump file you’re restoring, including server name (if needed).
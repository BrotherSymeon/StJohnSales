var _ = require('underscore')._;
var Backbone = require('backbone');
var mysql = require('mysql');
var debug = require('debug');
var log = debug('sales:mysqlModel');

module.exports = function (dbConfig) {
  dbConfig.connectionLimit = 5;
  //dbConfig.multipleStatements = true;
  var pool = mysql.createPool(dbConfig);
  const ISO_LEVEL = 'SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;';
  const START = 'START TRANSACTION;';
  const COMMIT = 'COMMIT;';

  // Main model
  var model = Backbone.Model.extend({
    wrapQuery: function (sql) {
      //return ISO_LEVEL + START + sql + COMMIT;
      return sql;
    },
    // Function instead of set, removes functions passed back in results by node-mysql
    setSQL: function (sql) {
      for (var key in sql) {
        if (typeof sql[key] !== 'function') {
          this.set(key, sql[key]);
        }
      }
    },
    // Function for creating custom queries
    query: function (query, callback) {
      var self = this;
      return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
          connection.query(self.wrapQuery(query), function (
            err,
            result,
            fields
          ) {
            connection.release();
            if (callback) {
              return callback(err, result, fields);
            }
            if (err) {
              return reject(err);
            }
            resolve(result, fields);
          });
        });
      });
    },

    queryOptions: function (query, values, callback) {
      return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
          connection.query(query, values, function (err, result, fields) {
            if (callback) {
              return callback(err, result, fields);
            }
            if (err) {
              return reject(err);
            }
            connection.release();
            resolve(result, fields);
          });
        });
      });
    },
    // Function returning one set of results and setting it to model it was used on
    read: function (id, callback) {
      root = this;
      if (this.tableName) var tableName = this.tableName;
      else var tableName = this.attributes.tableName;
      if (!id) {
        id = this.attributes.id;
      } else if (typeof id === 'function') {
        callback = id;
        id = this.attributes.id;
      }
      var q = 'SELECT * FROM ' + tableName + ' WHERE id=' + id;
      pool.getConnection(function (err, connection) {
        connection.query(q, root, function (err, result, fields) {
          root.setSQL(result[0]);
          if (callback) {
            callback(err, result[0], fields);
          }
          connection.release();
        });
      });
    },
    // Function with set of methods to return records from database
    find: function (method, conditions, callback) {
      var self = this;
      return new Promise(function (resolve, reject) {
        if (typeof method === 'function') {
          callback = method;
          method = 'all';
          conditions = {};
        } else if (typeof conditions === 'function') {
          callback = conditions;
          conditions = {};
        }
        if (self.tableName) var tableName = self.tableName;
        else var tableName = self.attributes.tableName;
        // building query conditions
        var qcond = '';
        var fields = '*';
        log('conditions = %o', conditions);
        if (conditions['fields']) {
          fields = conditions['fields'];
        }
        if (conditions['where']) {
          qcond += ' WHERE ' + conditions['where'];
        }
        if (conditions['group']) {
          qcond += ' GROUP BY ' + conditions['group'];
          if (conditions['groupDESC']) {
            qcond += ' DESC';
          }
        }
        if (conditions['having']) {
          qcond += ' HAVING ' + conditions['having'];
        }
        if (conditions['order']) {
          qcond += ' ORDER BY ' + conditions['order'];
          if (conditions['orderDESC']) {
            qcond += ' DESC';
          }
        }
        if (conditions['limit']) {
          qcond += ' LIMIT ' + conditions['limit'];
        }

        switch (method) {
          // default method
          case 'all':
            var q = 'SELECT ' + fields + ' FROM ' + tableName + qcond;
            pool.getConnection(function (err, connection) {
              log('running query for all %o', q);
              connection.query(q, function (err, result, fields) {
                if (callback) {
                  return callback(err, result, fields);
                }
                if (err) {
                  return reject(err);
                }
                connection.release();
                return resolve(result);
              });
            });
            break;
          // method returning value of COUNT(*)
          case 'count':
            var q = 'SELECT COUNT(*) FROM ' + tableName + qcond;
            pool.getConnection(function (err, connection) {
              log('running query for count %o ', q);
              connection.query(q, function (err, result, fields) {
                if (callback) {
                  return callback(err, result[0]['COUNT(*)'], fields);
                }
                if (err) {
                  return reject(err);
                }
                connection.release();
                return resolve(result);
              });
            });
            break;
          // method returning only first result (to use when you expect only one result)
          case 'first':
            var q = 'SELECT ' + fields + ' FROM ' + tableName + qcond;
            pool.getConnection(function (err, connection) {
              connection.query(q, function (err, result, fields) {
                connection.release();
                if (!err) {
                  if (result && result.length) {
                    self.setSQL(result[0]);
                  } else {
                    self.setSQL(result);
                  }
                }
                if (callback) {
                  if (result && result.length) {
                    return callback(err, result[0], fields);
                  } else {
                    return callback(err, result, fields);
                  }
                } else {
                  if (err) {
                    return reject(err);
                  }
                  return resolve(result);
                }
              });
            });
            break;
          // method returning only value of one field (if specified in 'fields') form first result
          case 'field':
            var q = 'SELECT ' + fields + ' FROM ' + tableName + qcond;
            pool.getConnection(function (err, connection) {
              connection.query(q, function (err, result, fields) {
                connection.release();
                for (var key in result[0]) break;
                if (callback) {
                  return callback(err, result[0][key], fields);
                }
                if (err) {
                  return reject(err);
                }
                return resolve(result);
              });
            });
            break;
        }
      });
    },
    // Function saving your model attributes
    save: function (where, callback) {
      var self = this;
      return new Promise(function (resolve, reject) {
        if (typeof where === 'function') {
          callback = where;
          where = null;
        }
        if (self.tableName) var tableName = self.tableName;
        else var tableName = self.attributes.tableName;
        if (where) {
          var id = null;
          if (self.has('id')) {
            id = self.get('id');
            delete self.attributes.id;
          }
          var q =
            'UPDATE ' +
            tableName +
            ' SET ' +
            pool.escape(self.attributes) +
            ' WHERE ' +
            where.WHERE;
          if (id) {
            self.set('id', id);
          }
          var check = 'SELECT * FROM ' + tableName + ' WHERE ' + where.WHERE;
          pool.getConnection(function (err, connection) {
            log('#save running sql = %o', check);
            connection.query(check, function (err, result, fields) {
              if (result[0]) {
                log('running sql = %o', q);
                connection.query(q, function (err, result) {
                  connection.release();
                  if (callback) {
                    return callback(err, result, connection);
                  }
                  if (err) {
                    return reject(err);
                  }
                  return resolve(result);
                });
              } else {
                connection.release();
                err = 'ERROR: Record not found';
                if (callback) {
                  return callback(err, result, connection);
                }
                return reject(new Error(err));
              }
            });
          });
        } else {
          if (self.has('id')) {
            var id = self.get('id');
            delete self.attributes.id;
            var q =
              'UPDATE ' +
              tableName +
              ' SET ' +
              pool.escape(self.attributes) +
              ' WHERE id=' +
              pool.escape(id);
            self.set('id', id);
            var check =
              'SELECT * FROM ' + tableName + ' WHERE id=' + pool.escape(id);
            pool.getConnection(function (err, connection) {
              log('running sql= %o', check);
              connection.query(check, function (err, result, fields) {
                if (result[0]) {
                  log('running sql= %o', q);
                  connection.query(q, function (err, result) {
                    if (callback) {
                      return callback(err, result, connection);
                    }
                    if (err) {
                      return reject(err);
                    }
                    return resolve(result);
                  });
                } else {
                  err = 'ERROR: Record not found';
                  if (callback) {
                    return callback(err, result);
                  }
                  return reject(new Error(err));
                }
              });
              connection.release();
            });
          } else {
            // Create new record
            var q =
              'INSERT INTO ' +
              tableName +
              ' SET ' +
              pool.escape(self.attributes) +
              ';';
            pool.getConnection(function (err, connection) {
              log('running sql= %o', q);
              connection.query(self.wrapQuery(q), function (err, result) {
                connection.release();
                if (callback) {
                  return callback(err, result);
                }
                if (err) {
                  return reject(err);
                }
                return resolve(result);
              });
            });
          }
        }
      });
    },
    // Function for removing records
    remove: function (where, callback) {
      if (typeof where === 'function') {
        callback = where;
        where = null;
      }
      if (this.tableName) var tableName = this.tableName;
      else var tableName = this.attributes.tableName;
      if (where) {
        var q = 'DELETE FROM ' + tableName + ' WHERE ' + where;
        var check = 'SELECT * FROM ' + tableName + ' WHERE ' + where;
        pool.getConnection(function (err, connection) {
          connection.query(check, function (err, result, fields) {
            if (result[0]) {
              connection.query(q, function (err, result) {
                if (callback) {
                  callback(err, result, connection);
                }
              });
            } else {
              err = 'ERROR: Record not found';
              callback(err, result, connection);
            }
          });
          connection.release();
        });
      } else {
        if (this.has('id')) {
          var q =
            'DELETE FROM ' +
            tableName +
            ' WHERE id=' +
            pool.escape(this.attributes.id);
          var check =
            'SELECT * FROM ' +
            tableName +
            ' WHERE id=' +
            pool.escape(this.attributes.id);
          this.clear();
          pool.getConnection(function (err, connection) {
            connection.query(check, function (err, result, fields) {
              if (result[0]) {
                connection.query(q, function (err, result) {
                  if (callback) {
                    callback(err, result, connection);
                  }
                });
              } else {
                err = 'ERROR: Record not found';
                callback(err, result, connection);
              }
            });
            connection.release();
          });
        } else {
          err = 'ERROR: Model has no specified ID, delete aborted';
          if (callback) {
            callback(err, result, connection);
          }
        }
      }
    },
    killConnection: function (cb) {
      cb = cb || function () {};
      connection.end(cb);
    }
  });

  return model;
};

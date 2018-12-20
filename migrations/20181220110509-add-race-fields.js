'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.addColumn('races', 'text', {
    type: 'string',
    notNull: false
  });
  return db.addColumn('races', 'series', {
    type: 'string',
    notNull: false
  });
};

exports.down = function(db) {
   db.removeColumn('races', 'text');
  return db.removeColumn('races', 'series');
};

exports._meta = {
  "version": 1
};

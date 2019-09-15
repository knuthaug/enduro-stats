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
  db.addColumn('races', 'lat', {
    type: 'real',
    notNull: false
  });
  db.addColumn('races', 'long', {
    type: 'real',
    notNull: false
  });
  return db.addColumn('races', 'files', {
    type: 'string',
    notNull: false
  });
};

exports.down = function(db) {
  db.removeColumn('races', 'lat');
  db.removeColumn('races', 'long');
  return db.removeColumn('races', 'files');
};

exports._meta = {
  "version": 1
};

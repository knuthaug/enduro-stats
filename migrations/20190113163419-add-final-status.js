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
  db.addColumn('raw_results', 'final_status', {
    type: 'string',
    notNull: false
  })
  return db.addColumn('results', 'final_status', {
    type: 'string',
    notNull: false
  })
};

exports.down = function(db) {
  db.removeColumn('raw_results', 'final_status')
  return db.removeColumn('results', 'final_status')
};

exports._meta = {
  "version": 1
};

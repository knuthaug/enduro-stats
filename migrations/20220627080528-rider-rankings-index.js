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

exports.up = function (db) {
  return db.addIndex('rider_rankings', 'rider_rankings_idx', ['id', 'score', 'average_best_year', 'rider_id'], true)
}

exports.down = function (db) {
  return db.removeIndex('rider_rankings_idx')
}

exports._meta = {
  "version": 1
};

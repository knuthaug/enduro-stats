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
  return db.addIndex('rider_races', 'rider_races_rider_id_idx', ['rider_id'], false);
};

exports.down = function(db) {
  return db.removeIndex('rider_races', 'rider_races_rider_id_idx')
};

exports._meta = {
  "version": 1
};

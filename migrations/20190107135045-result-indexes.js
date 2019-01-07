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
  db.addIndex('results', 'results_rider_id_idx', ['rider_id'], false);
  return db.addIndex('results', 'results_race_rider_id_idx', ['race_id'], false);
};

exports.down = function(db) {
  db.removeIndex('results', 'results_rider_id_idx')
  return db.removeIndex('results', 'results_race_rider_id_idx')
};

exports._meta = {
  "version": 1
};

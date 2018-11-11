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
  return db.addIndex('stages', 'stages_stage_race_unique', ['number', 'race_id'], true)
};

exports.down = function(db) {
  return db.removeIndex('stages', 'stages_stage_race_unique');
};

exports._meta = {
  "version": 1
};

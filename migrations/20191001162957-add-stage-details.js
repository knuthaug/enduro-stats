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
  return db.createTable('stages_details', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'text',
      notNull: true
    },
    strava_name: {
      type: 'text',
      notNull: true
    },
    strava_url: {
      type: 'text',
      notNull: true
    },
    filename: {
      type: 'text',
      notNull: true
    },
    race_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'race_stage_details_id_fk',
        table: 'races',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('stages_details')
};

exports._meta = {
  "version": 1
};

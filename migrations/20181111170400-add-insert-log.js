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
  return db.createTable('insert_log', {
    id: {
      type: 'int',
      autoIncrement: true,
      notNull: true
    },
    stage_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'stage_insert_log_id_fk',
        table: 'stages',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    race_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'race_insert_log_id_fk',
        table: 'races',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          race_id: 'id'
        }
      }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('insert_log')
};

exports._meta = {
  "version": 1
};

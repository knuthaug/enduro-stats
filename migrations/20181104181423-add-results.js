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
  return db.createTable('results', {
    id: {
      type: 'int',
      primaryKey: true,
      autoincrement: true
    },
    rank: 'int',
    stage: 'int',
    time: 'time',
    status: 'string',
    class: 'string',
    rider_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'rider_result_id_fk',
        table: 'riders',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    race_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'race_result_id_fk',
        table: 'races',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          race_id: 'id'
        }
      }
    }
  })
}

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};

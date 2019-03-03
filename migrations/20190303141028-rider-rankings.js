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
  return db.createTable('rider_rankings', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    score: {
      type: 'real',
      notNull: false
    },
    best_year: {
      type: 'int',
      notNull: false
    },
    average_best_year: {
      type: 'real',
      notNull: false
    },
    sequence_number: {
      type: 'int',
      notNull: false
    },
    rider_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'rider_rankings_id_fk',
        table: 'riders',
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
  return db.dropTable('rider_rankings')
};

exports._meta = {
  "version": 1
};

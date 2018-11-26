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
  return db.createTable('stage_results', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    rank: {
      type: 'int',
      notNull: true
    },
    rank_total: {
      type: 'int',
      notNull: true
    },
    timems: {
      type: 'int',
      notNull: true
    },
    behindms: {
      type: 'int',
      notNull: true
    },
    behind_percent: {
      type: 'int',
      notNull: true
    },
    behind_leader_ms: {
      type: 'int',
      notNull: true
    },
    behind_leader_percent: {
      type: 'int',
      notNull: true
    },
    status: {
      type: 'string',
      notNull: true
    },
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
    stage_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'rider_result_stage_id_fk',
        table: 'stages',
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
};

exports.down = function(db) {
  return db.dropTable('stage_results')
};

exports._meta = {
  "version": 1
};

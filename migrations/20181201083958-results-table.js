'use strict'

var dbm
var type
var seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db) {
  return db.createTable('results', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    rank: {
      type: 'int',
      notNull: false
    },
    time: {
      type: 'string',
      notNull: true
    },
    stage_time_ms: {
      type: 'int',
      notNull: true
    },
    status: {
      type: 'string',
      notNull: true
    },
    class: {
      type: 'string',
      notNull: true
    },
    acc_time_ms: {
      type: 'int',
      notNull: true
    },
    acc_time_behind: {
      type: 'int',
      notNull: false
    },
    final_rank: {
      type: 'int',
      notNull: false
    },
    behind_leader_ms: {
      type: 'int',
      notNull: false
    },
    stage_rank: {
      type: 'int',
      notNull: true
    },
    stage_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'stage_result_id_fk',
        table: 'stages',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
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

exports.down = function (db) {
  return db.dropTable('results')
}

exports._meta = {
  'version': 1
}

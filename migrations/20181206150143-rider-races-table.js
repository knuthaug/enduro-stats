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
  return db.createTable('rider_races', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    final_rank: {
      type: 'int'
    },
    rider_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'rider_race_id_fk',
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
        name: 'race_rider_id_fk',
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
  return db.dropTable('rider_races')
}

exports._meta = {
  'version': 1
}

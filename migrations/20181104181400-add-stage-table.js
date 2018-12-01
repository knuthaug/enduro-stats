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
  return db.createTable('stages', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'text',
      notNull: true
    },
    number: {
      type: 'int',
      notNull: true
    },
    race_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'race_stage_id_fk',
        table: 'races',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  })
}

exports.down = function (db) {
  return db.dropTable('stages')
}

exports._meta = {
  'version': 1
}

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
  return db.createTable('riders', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      notNull: true
    },
    gender: {
      type: 'string',
      notNull: true
    },
    uid: {
      type: 'string',
      notNull: true,
      unique: true
    },
    club: {
      type: 'string',
      notNull: false
    },
    team: {
      type: 'string',
      notNull: false
    }
  })
}

exports.down = function (db) {
  return db.dropTable('riders')
}

exports._meta = {
  'version': 1
}

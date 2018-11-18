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
  return db.createTable('races', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      notNull: true}
    ,
    stages: {
      type: 'int',
      notNull: true
    },
    year: {
      type: 'string',
      notNull: true
    },
    date: {
      type: 'string',
      notNull: true
    }
  })
}

exports.down = function(db) {
  return db.dropTable('races')
};

exports._meta = {
  "version": 1
};

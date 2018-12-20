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
  return db.createTable('race_links', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: 'string',
      notNull: false
    },
    url: {
      type: 'string',
      notNull: true
    },
    description: {
      type: 'string',
      notNull: true
    },
    race_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'race_links_id_fk',
        table: 'races',
        rules: {
          onDelete: 'NO ACTION',
          onUpdate: 'RESTRICT'
        },
        mapping: {
          race_id: 'id'
        }
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('race_links');
};

exports._meta = {
  "version": 1
};

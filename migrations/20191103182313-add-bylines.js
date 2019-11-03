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
  db.addColumn('riders', 'byline_text', {
    type: 'string',
    notNull: false
  });
  db.addColumn('riders', 'byline_url', {
    type: 'string',
    notNull: false
  });

  db.addColumn('races', 'byline_text', {
    type: 'string',
    notNull: false
  });

  return db.addColumn('races', 'byline_url', {
    type: 'string',
    notNull: false
  });
};

exports.down = function(db) {
  db.removeColumn('riders', 'byline_text');
  db.removeColumn('riders', 'byline_text');
  db.removeColumn('races', 'byline_text');
  return db.removeColumn('races', 'byline_text');
};

exports._meta = {
  "version": 1
};

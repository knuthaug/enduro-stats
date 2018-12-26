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
  db.addColumn('riders', 'search', {
    type: 'tsvector'
  })

  const sql = "CREATE INDEX riders_search_index ON riders USING GIN (search);"
  db.runSql(sql)

  const trigger = "CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON riders FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(search, 'pg_catalog.norwegian', name, club);"
  return db.runSql(trigger)
};

exports.down = function(db) {
  return db.removeIndex('riders', 'riders_search_index')
  return db.removeColumn('riders', 'search')
};

exports._meta = {
  "version": 1
};

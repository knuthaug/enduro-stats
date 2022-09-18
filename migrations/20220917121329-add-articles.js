"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("articles", {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true,
    },
    frontpage_title: {
      type: "string",
      notNull: true,
      unique: false,
    },
    frontpage_ingress: {
      type: "string",
      notNull: true,
      unique: false,
    },
    frontpage_image_url: {
      type: "string",
      notNull: false,
      unique: false,
    },
    frontpage_image_byline: {
      type: "string",
      notNull: false,
      unique: false,
    },
    frontpage_image_byline_url: {
      type: "string",
      notNull: false,
      unique: false,
    },
    body: {
      type: "string",
      notNull: true,
    },
    title: {
      type: "string",
      notNull: true,
    },
    date: {
      type: "string",
      notNull: true,
    },
    permalink: {
      type: "string",
      notNull: true,
    },
  });
};

exports.down = function (db) {
  return db.dropTable("articles");
};

exports._meta = {
  version: 1,
};

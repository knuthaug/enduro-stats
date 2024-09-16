const pino = require("pino");
const config = require("../config");

const logger = pino({
  name: "enduro-stats",
  level: config.get("loglevel"),
});

module.exports = logger;

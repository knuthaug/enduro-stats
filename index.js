const { app, stop } = require("./server/app");
const log = require("./server/log.js");

const port = process.env.PORT || 8080;

const server = app.listen({ port }, (err) => {
  if (err) throw err;
  log.info(`Started on http://localhost:${port}`);
});

module.exports.app = app;

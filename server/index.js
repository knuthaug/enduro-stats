const app = require('./app')
const log = require('./log.js')

const server = app.listen(8080, () => {
  log.info(`Started on http://localhost:${8080}`)
})

function stop() {
  server.close()
}

module.exports.stop = stop
module.exports.app = app

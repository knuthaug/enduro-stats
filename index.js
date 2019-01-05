const app = require('./server/app')
const log = require('./server/log.js')

const port = process.env.PORT || 8080

const server = app.listen(port, () => {
  log.info(`Started on http://localhost:${port}`)
})

function stop () {
  server.close()
}

module.exports.stop = stop
module.exports.app = app

const express = require('express')
const http = require('http')
const hbs = require('express-handlebars')
const compression = require('compression')
const config = require('../config')
const log = require('./log.js')

const app = express()

app.use(compression())
app.disable('x-powered-by')

let server

app.engine('handlebars', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/assets/js/:file', (req, res) => {
  const file = req.params.file
  const options = { root: './dist' }

  return res.sendFile(`js/${file}`, options)
})

app.get('/assets/css/:file', (req, res) => {
  const file = req.params.file
  const options = { root: './dist' }

  return res.sendFile(`css/${file}`, options)
})

// just server stuff to make testing way easier
module.exports.start = function start () {
  server = http.createServer(app)
  const port = 8080
  server.listen(port, () => {
    log.info(`Started on http://localhost:${port}`)
  })
}

module.exports.stop = function stop () {
  health.destroy()
  server.close()
}

/* eslint-disable no-process-exit */
process.on('uncaughtException', error => {
  log.error('shutdown - server taken down by force due to a uncaughtException')
  log.error(error.message)
  log.error(error.stack)
  server.close()
  process.nextTick(() => {
    process.exit(1)
  })
})

process.on('SIGINT', () => {
  log.warn('shutdown - got SIGINT - taking down server gracefully')
  server.close()
  process.nextTick(() => {
    process.exit(0)
  })
})

module.exports.app = app

const express = require('express')
const http = require('http')
const hbs = require('express-handlebars')
const compression = require('compression')
const morgan = require('morgan')
const config = require('../config')
const log = require('./log.js')
const Db = require('./db.js')

const app = express()


app.use(compression())
app.disable('x-powered-by')

if(config.get('env') !== 'test') {
  app.use(morgan('tiny'))
}

let server
const db = new Db()

app.engine('handlebars', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
  log.debug('request for /')
  const races = await db.findRaces()
  res.render('index', { races })
})

app.get('/race/:uid', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)
  res.render('race', { race })
})

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

module.exports = app

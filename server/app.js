const express = require('express')
const http = require('http')
const hbs = require('express-handlebars')
const compression = require('compression')
const morgan = require('morgan')
const config = require('../config')
const log = require('./log.js')
const Db = require('./db.js')
const hashedAssets = require('../views/helpers/hashed-assets.js')
const compare = require('../views/helpers/compare.js')

const app = express()

app.use(compression())
app.disable('x-powered-by')

if (config.get('env') !== 'test') {
  app.use(morgan('tiny'))
}

let server
const db = new Db()

app.engine('handlebars', hbs({ defaultLayout: 'main', extname: '.hbs', helpers: { hashedAssets, compare } }))
app.set('view engine', 'handlebars')

app.get('/', async (req, res) => {
  log.debug('request for /')
  const races = await db.findRaces(6)
  res.render('index', { races })
})

app.get('/ritt/:uid', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)
  const raceClasses = await db.classesForRace(req.params.uid)

  const results = { }
  for(let i = 0; i < raceClasses.length; i++) {
    results[raceClasses[i]] = []
  }
  console.log(results)
  res.render('race', { race, results, active: 'ritt' })
})

app.get('/ritt', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const races = await db.findRaces()
  res.render('races', { races, active: 'ritt' })
})

app.get('/assets/js/:file', (req, res) => {
  const file = req.params.file
  const options = { root: './server/dist' }
  return res.sendFile(`js/${file}`, options)
})

app.get('/assets/js/vendor/:file', (req, res) => {
  const file = req.params.file
  const options = { root: './server/dist/' }
  return res.sendFile(`js/vendor/${file}`, options)
})

app.get('/assets/css/:file', (req, res) => {
  const file = req.params.file
  const options = { root: './server/dist' }
  return res.sendFile(`css/${file}`, options)
})

module.exports = app

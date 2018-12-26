const express = require('express')
const http = require('http')
const hbs = require('express-handlebars')
const compression = require('compression')
const morgan = require('morgan')
const config = require('../config')
const log = require('./log.js')
const Db = require('./db.js')
const resultViewMapper = require('./resultViewMapper.js')
const raceViewMapper = require('./raceViewMapper.js')
const riderViewMapper = require('./riderViewMapper.js')

const hashedAssets = require('../views/helpers/hashed-assets.js')
const compare = require('../views/helpers/compare.js')
const propFor = require('../views/helpers/propFor.js')
const toJson = require('../views/helpers/toJson.js')
const isDNF = require('../views/helpers/isDNF.js')
const isDNS = require('../views/helpers/isDNS.js')
const isError = require('../views/helpers/isError.js')
const isOK = require('../views/helpers/isOK.js')

const app = express()

app.use(compression())
app.disable('x-powered-by')

if (config.get('env') !== 'test') {
  app.use(morgan('tiny'))
}

let server
const db = new Db()

app.engine('handlebars', hbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: { hashedAssets, compare, propFor, toJson, isDNF, isDNS, isError, isOK },
  partialsDir: 'views/partials'
}))

app.set('view engine', 'handlebars')

app.get('/', async (req, res) => {
  log.debug('request for /')
  const races = await db.findRaces(10)
  const { raceCount, riderCount, stageCount } = await db.statCounts()
  res.render('index', { races, raceCount, riderCount, stageCount })
})

app.get('/ritt/:uid', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)
  const links = await db.findRaceLinks(race.id)
  const raceClasses = await db.classesForRace(req.params.uid)
  const raceResults = await db.raceResults(req.params.uid)
  const [stages, results] = resultViewMapper(raceClasses, raceResults)
  const noResults = Object.values(results).length > 0

  res.render('race', {
    race,
    stages,
    results,
    links,
    noResults,
    tables: true,
    active: 'ritt' })
})

app.get('/ritt', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const races = raceViewMapper(await db.findRaces())
  res.render('races', { races, active: 'ritt' })
})

app.get('/rytter/:uid', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const rider = await db.findRider(req.params.uid)
  const races = riderViewMapper(await db.raceResultsForRider(req.params.uid))
  const numRaces = races.length

  const raceIds = races.map((r) => {
    return { race: r.race, class: r.class }
  })

  const ridersPerClass = await db.ridersForClassAndRace(raceIds)

  const results = races.map((r) => {
    return Object.assign(r, { count: ridersPerClass[r.race] })
  }).sort((a, b) => {
    return b.year - a.year
  })

  const startYear = results[results.length - 1].year
  res.render('rider', {
    rider,
    numRaces,
    startYear,
    results,
    active: 'ryttere' })
})

app.get('/ryttere', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const riders = await db.findAllRiders()
  res.render('riders', { riders, active: 'ryttere' })
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

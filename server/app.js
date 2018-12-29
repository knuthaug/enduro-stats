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
const bestSeason = require('./bestSeason.js')

const hashedAssets = require('../views/helpers/hashed-assets.js')
const compare = require('../views/helpers/compare.js')
const propFor = require('../views/helpers/propFor.js')
const toJson = require('../views/helpers/toJson.js')
const isDNF = require('../views/helpers/isDNF.js')
const isDNS = require('../views/helpers/isDNS.js')
const isError = require('../views/helpers/isError.js')
const isOK = require('../views/helpers/isOK.js')
const DEFAULT_CACHE_TIME_PAGES = 5000
const app = express()

app.use(compression())
app.disable('x-powered-by')
app.use(express.urlencoded());

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
  render(res, 'index', { races, raceCount, riderCount, stageCount }, 60)
//  res.render('index', { })
})

app.get('/ritt/:uid', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)
  const links = await db.findRaceLinks(race.id)
  const raceClasses = await db.classesForRace(req.params.uid)
  const raceResults = await db.raceResults(req.params.uid)
  const [stages, results] = resultViewMapper(raceClasses, raceResults)
  const noResults = Object.values(results).length > 0

  render(res, 'race', {
    race,
    stages,
    results,
    links,
    noResults,
    tables: true,
    active: 'ritt' }, DEFAULT_CACHE_TIME_PAGES)
})

app.post('/sok/', async(req, res) => {
  let results = await db.search(req.body.search)

  if(results.length === 0) {
    results = await db.searchLike(req.body.search, 50)
  }

  res.render('search', {
    results
  })
})

app.get('/api/search', async (req, res) => {

  let results = await db.search(req.query.q)

  if(results.length === 0) {
    results = await db.searchLike(req.query.q)
  }

  res.json(results)
})

app.get('/ritt', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const races = raceViewMapper(await db.findRaces())
  render(res, 'races', { races, active: 'ritt' }, DEFAULT_CACHE_TIME_PAGES)
})

app.get('/om', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const races = raceViewMapper(await db.findRaces())
  render(res, 'about', { active: 'om' }, DEFAULT_CACHE_TIME_PAGES)
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

  const { year, avg } = bestSeason(results)

  const startYear = results[results.length - 1].year
  render(res, 'rider', {
    rider,
    numRaces,
    startYear,
    year,
    avg,
    results,
    active: 'ryttere' }, DEFAULT_CACHE_TIME_PAGES)
})

app.get('/ryttere', async (req, res) => {
  log.debug(`request for ${req.path}`)
  const riders = await db.findAllRiders()
  render(res, 'riders', { riders, active: 'ryttere' }, DEFAULT_CACHE_TIME_PAGES)
})

app.get('/assets/js/:file', (req, res) => {
  const file = req.params.file
  const options = { root: './server/dist' }

  if(/bundle/.test(file)) {
    return res.set({'Cache-Control': 'public, max-age=100000'}).sendFile(`js/${file}`, options)
  }
  return res.set({'Cache-Control': 'public, max-age=1000'}).sendFile(`js/${file}`, options)
})

app.get('/assets/css/:file', (req, res) => {
  const file = req.params.file
  const options = { root: './server/dist' }

  if(/bundle/.test(file) || /sort/.test(file)) {
    return res.set({'Cache-Control': 'public, max-age=100000'}).sendFile(`css/${file}`, options)    
  }
  return res.set({'Cache-Control': 'public, max-age=1000'}).sendFile(`css/${file}`, options)
})

function render(res, template, context, maxAge) {
  return res
    .set({'Cache-Control': `public, max-age=${maxAge}`})
    .render(template, context)
}



module.exports = app

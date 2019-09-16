const express = require('express')
const hbs = require('express-handlebars')
const compression = require('compression')
const morgan = require('morgan')
const config = require('../config')
const log = require('./log')
const Db = require('./db')
const handlers = require('./handlers')
const helpers = require('./helpers')

const DEFAULT_CACHE_TIME_PAGES = 5000
const ASSET_LONG_CACHE_TIME = 100000
const ASSET_SHORT_CACHE_TIME = 1000
const NOT_FOUND_CACHE_TIME = 60
const app = express()

const handler = function (template, dataHandler, cacheTime) {
  return async function (req, res) {
    const context = await dataHandler(req)
    console.log(context)
    if (context.status !== 200) {
      return render(res, '404', context, NOT_FOUND_CACHE_TIME, 404)
    }
    return render(res, template, context, cacheTime || DEFAULT_CACHE_TIME_PAGES)
  }
}

const jsonHandler = function (dataHandler) {
  return async function (req, res) {
    return res.json(await dataHandler(req))
  }
}

app.use(compression())
app.disable('x-powered-by')
app.use(express.urlencoded())

if (config.get('env') !== 'test') {
  app.use(morgan('tiny'))
}

const db = new Db()

app.engine('handlebars', hbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers,
  partialsDir: 'views/partials'
}))

app.set('view engine', 'handlebars')

app.get('/', handler('index', handlers.indexHandler, 2000))
app.get('/ritt', handler('races', handlers.racesHandler))
app.get('/ritt/:uid', handler('race', handlers.raceHandler, DEFAULT_CACHE_TIME_PAGES))
app.get('/ritt/:uid/full', handler('fullrace', handlers.fullRaceHandler, DEFAULT_CACHE_TIME_PAGES))
app.get('/om', handler('about', () => { return { status: 200, active: 'om', title: 'Om norsk enduro' } }))
app.get('/kalender', handler('cal', () => { return { status: 200, active: 'cal', title: 'Rittkalender 2019' } }))
app.get('/rytter/:uid', handler('rider', handlers.riderHandler))
app.get('/ryttere', handler('riders', handlers.ridersHandler))
app.get('/ranking', handler('rank', handlers.rankHandler))
app.get('/sammenlign', handler('compare', handlers.compareHandler))
app.get('/api/search', jsonHandler(handlers.jsonSearchHandler))
app.get('/api/graph/compare', jsonHandler(handlers.compareGraphHandler))
app.get('/site.webmanifest', jsonHandler(handlers.manifestHandler))

app.post('/sok/', handler('search', handlers.searchHandler, 100))

app.get('/assets/js/:file', (req, res) => {
  log.debug(`request for ${req.path}`)
  const file = req.params.file
  const options = { root: './server/dist' }

  if (/bundle/.test(file) || /race/.test(file) || /rider/.test(file) || /compare/.test(file)) {
    return res.set({ 'Cache-Control': `public, max-age=${ASSET_LONG_CACHE_TIME}` }).sendFile(`js/${file}`, options)
  }
  return res.set({ 'Cache-Control': `public, max-age=${ASSET_SHORT_CACHE_TIME}` }).sendFile(`js/${file}`, options)
})

app.get('/assets/img/:file', (req, res) => {
  log.debug(`request for ${req.path}`)
  const file = req.params.file
  const options = { root: './server/dist' }

  return res.set({ 'Cache-Control': `public, max-age=${ASSET_LONG_CACHE_TIME}` }).sendFile(`img/${file}`, options)
})

app.get('/assets/css/:file', (req, res) => {
  const file = req.params.file
  const options = { root: './server/dist' }

  if (/bundle/.test(file) || /sort/.test(file)) {
    return res.set({ 'Cache-Control': `public, max-age=${ASSET_LONG_CACHE_TIME}` }).sendFile(`css/${file}`, options)
  }
  return res.set({ 'Cache-Control': `public, max-age=${ASSET_SHORT_CACHE_TIME}` }).sendFile(`css/${file}`, options)
})

function render (res, template, context, maxAge, status) {
  const s = status || 200
  return res
    .status(s)
    .set({ 'Cache-Control': `public, max-age=${maxAge}` })
    .render(template, context)
}

function stop () {
  db.destroy()
}

module.exports.app = app
module.exports.stop = stop

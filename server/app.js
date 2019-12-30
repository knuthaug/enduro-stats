const Fastify = require('fastify')
const fastifyStatic = require('fastify-static')
const compression = require('fastify-compress')
const pointOfView = require('point-of-view')
const handlebars = require('handlebars')
const morgan = require('morgan')
const config = require('../config')
const path = require('path')
const log = require('./log')
const Db = require('./db')
const handlers = require('./handlers')
const helpers = require('./helpers')

const DEFAULT_CACHE_TIME_PAGES = 5000
const ASSET_LONG_CACHE_TIME = 400000
const ASSET_SHORT_CACHE_TIME = 7000
const NOT_FOUND_CACHE_TIME = 60

const app = Fastify({
  logger: true
})

handlebars.registerHelper('hashedAssets', require('../views/helpers/hashed-assets.js'))
handlebars.registerHelper('compare', require('../views/helpers/compare.js'))

app.register(fastifyStatic, {
  root: path.join(__dirname, 'dist')
})
app.register(compression)

app.register(pointOfView, {
  engine: {
    handlebars: handlebars
  },
  templates: 'views',
  layout: '../views/layouts/main.hbs',
  options: {
    partials: {
      analytics: 'partials/analytics.hbs',
      icon: 'partials/icon.hbs',
      'rider-bio': 'partials/rider-bio.hbs',
      'series': 'partials/series.hbs',
      'stagetime': 'partials/stagetime.hbs',
    }
  }
})

const db = new Db()

const handler = function (template, dataHandler, cacheTime) {
  return async function (req, res) {
    const context = await dataHandler(req)
    if (context.status !== 200) {
      return render(res, '404', context, NOT_FOUND_CACHE_TIME, 404)
    }
    return render(res, template, context, cacheTime || DEFAULT_CACHE_TIME_PAGES)
  }
}

const jsonHandler = function (dataHandler) {
  return async function (req, res) {
    return res.send(await dataHandler(req))
  }
}

app.get('/', handler('index.hbs', handlers.indexHandler, 2000))
app.get('/site.webmanifest', jsonHandler(handlers.manifestHandler))
app.get('/ritt', handler('races', handlers.racesHandler))
app.get('/ritt/:uid', handler('race', handlers.raceHandler, DEFAULT_CACHE_TIME_PAGES))
app.get('/ritt/:uid/full', handler('fullrace', handlers.fullRaceHandler, DEFAULT_CACHE_TIME_PAGES))
app.get('/om', handler('about', () => { return { status: 200, active: 'om', title: 'Om norsk enduro' } }))
app.get('/rytter/:uid', handler('rider', handlers.riderHandler))
app.get('/ryttere', handler('riders', handlers.ridersHandler))
app.get('/ranking', handler('rank', handlers.rankHandler))
app.get('/sammenlign', handler('compare', handlers.compareHandler))
app.get('/kart/:uid', handler('map', handlers.mapHandler))
app.get('/api/search', jsonHandler(handlers.jsonSearchHandler))
app.get('/api/graph/compare', jsonHandler(handlers.compareGraphHandler))
app.get('/kalender', handler('cal', () => {
  return {
    status: 200,
    active: 'cal',
    title: 'Rittkalender 2020',
    docTitle: 'Norsk enduro: Rittkalender for sesongen 2020',
    description: 'Rittkalender for sesongen 2020'
  }
}))

app.post('/sok/', handler('search', handlers.searchHandler, 100))

app.get('/img/:file', (req, res) => {
  const file = req.params.file
  return res.header('Cache-Control', `public, max-age=${ASSET_LONG_CACHE_TIME}`).sendFile(`img/${file}`)
})

app.get('/assets/js/:file', (req, res) => {
  const file = req.params.file

  if (/bundle/.test(file) || /race/.test(file) || /rider/.test(file) || /compare/.test(file)) {
    return res.header('Cache-Control', `public, max-age=${ASSET_LONG_CACHE_TIME}`).sendFile(`js/${file}`)
  }

  return res.header('Cache-Control', `public, max-age=${ASSET_SHORT_CACHE_TIME}`).sendFile(`js/${file}`)
})

app.get('/assets/img/:file', (req, res) => {
  log.debug(`request for ${req.path}`)
  const file = req.params.file

  return res.header('Cache-Control', `public, max-age=${ASSET_LONG_CACHE_TIME}`).sendFile(`img/${file}`)
})

app.get('/assets/css/:file', (req, res) => {
  const file = req.params.file

  if (/bundle/.test(file) || /sort/.test(file)) {
    return res.header('Cache-Control', `public, max-age=${ASSET_LONG_CACHE_TIME}`).sendFile(`css/${file}`)
  }
  return res.header('Cache-Control', `public, max-age=${ASSET_SHORT_CACHE_TIME}`).sendFile(`css/${file}`)
})

async function render (res, template, context, maxAge, status) {
  const s = status || 200
  //const html = await app
  //      .view(template, context)
  //      .then(body => app.view('layouts/main.hbs', { body }))

  return res
    .type('text/html')
    .code(s)
    .header('Cache-Control',`public, max-age=${maxAge}`)
    .view(template, context)
}

function stop () {
  db.destroy()
}

module.exports.app = app
module.exports.stop = stop

const Fastify = require('fastify')
const fastifyStatic = require('fastify-static')
const compression = require('fastify-compress')
const pointOfView = require('point-of-view')
const formbody = require('fastify-formbody')
const handlebars = require('handlebars')
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

const isProduction = config.get('env') !== 'production'

const app = Fastify({
  logger: isProduction
})

handlebars.registerHelper('hashedAssets', require('../views/helpers/hashed-assets.js'))
handlebars.registerHelper('compare', require('../views/helpers/compare.js'))
handlebars.registerHelper('cat', require('../views/helpers/cat.js'))
handlebars.registerHelper('propFor', require('../views/helpers/propFor.js'))
handlebars.registerHelper('isDNF', require('../views/helpers/isDNF.js'))
handlebars.registerHelper('isDNS', require('../views/helpers/isDNS.js'))
handlebars.registerHelper('isDSQ', require('../views/helpers/isDSQ.js'))
handlebars.registerHelper('isError', require('../views/helpers/isError.js'))
handlebars.registerHelper('isOK', require('../views/helpers/isOK.js'))
handlebars.registerHelper('title', require('../views/helpers/title.js'))
handlebars.registerHelper('formatPercent', require('../views/helpers/formatPercent.js'))
handlebars.registerHelper('inc', require('../views/helpers/inc.js'))

app.register(fastifyStatic, {
  root: path.join(__dirname, 'dist')
})

app.register(compression)
app.register(formbody)

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

app.get('/', handler('index.hbs', handlers.indexHandler, 2000))
app.get('/site.webmanifest', jsonHandler(handlers.manifestHandler))
app.get('/ritt', handler('races.hbs', handlers.racesHandler))
app.get('/ritt/:uid', handler('race.hbs', handlers.raceHandler, DEFAULT_CACHE_TIME_PAGES))
app.get('/ritt/:uid/full', handler('fullrace.hbs', handlers.fullRaceHandler, DEFAULT_CACHE_TIME_PAGES))
app.get('/om', handler('about.hbs', () => { return { status: 200, active: 'om', title: 'Om norsk enduro' } }))
app.get('/rytter/:uid', handler('rider.hbs', handlers.riderHandler))
app.get('/ryttere', handler('riders.hbs', handlers.ridersHandler))
app.get('/ranking', handler('rank.hbs', handlers.rankHandler))
app.get('/sammenlign', handler('compare.hbs', handlers.compareHandler))
app.get('/kart/:uid', handler('map.hbs', handlers.mapHandler))
app.get('/api/search', jsonHandler(handlers.jsonSearchHandler))
app.get('/api/graph/compare', jsonHandler(handlers.compareGraphHandler))
app.get('/kalender', handler('cal.hbs', handlers.calendarHandler))

app.post('/sok/', handler('search.hbs', handlers.searchHandler, 100))

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

function handler(template, dataHandler, cacheTime) {
  return async function (req, res) {
    const context = await dataHandler(req)
    if (context.status !== 200) {
      return render(res, '404', context, NOT_FOUND_CACHE_TIME, 404)
    }
    return render(res, template, context, cacheTime || DEFAULT_CACHE_TIME_PAGES)
  }
}

function jsonHandler (dataHandler) {
  return async function (req, res) {
    return res.send(await dataHandler(req))
  }
}

async function render (res, template, context, maxAge, status) {
  const s = status || 200

  const html = await app.view(template, Object.assign({imageUrl: config.get('images.url')}, context))

  res
    .type('text/html')
    .code(s)
    .header('Cache-Control',`public, max-age=${maxAge}`)
    .send(html)
}

function stop () {
  db.destroy()
}

module.exports.app = app
module.exports.stop = stop

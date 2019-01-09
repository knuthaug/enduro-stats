const log = require('./log.js')
const Db = require('./db.js')
const resultViewMapper = require('./resultViewMapper.js')
const raceViewMapper = require('./raceViewMapper.js')
const riderViewMapper = require('./riderViewMapper.js')
const bestSeason = require('./bestSeason.js')
const compareAsc = require('date-fns/compare_asc')
const parse = require('date-fns/parse')

const db = new Db()

async function racesHandler(req) {
  const races = raceViewMapper(await db.findRaces())
  return {
    status: 200,
    races,
    active: 'ritt',
    title: 'Alle ritt : Norsk enduro'
  }
}

async function raceHandler (req) {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)

  if (!race.id) {
    return { status: 404}
  }

  const links = await db.findRaceLinks(race.id)
  const raceClasses = await db.classesForRace(req.params.uid)
  const raceResults = await db.raceResults(req.params.uid)
  const [stages, results, graphs] = resultViewMapper(raceClasses, raceResults)
  const noResults = Object.values(results).length > 0

  Object.keys(graphs).forEach((cl) => {
    graphs[cl] = JSON.stringify(graphs[cl])
  })

  return {
    status: 200,
    race,
    stages,
    results,
    links,
    graphs,
    noResults,
    active: 'ritt',
    title: `${race.name} ${race.year} : Norsk enduro`
  }
}

async function indexHandler () {
  log.debug('request for /')
  const races = await db.findRaces(10)
  const { raceCount, riderCount, stageCount } = await db.statCounts()
  return {
    status: 200,
    races,
    raceCount,
    riderCount,
    stageCount,
    title: 'Norsk enduro'
  }
}

async function ridersHandler (req) {
  log.debug(`request for ${req.path}`)
  const riders = await db.findAllRiders().then((data) => {
    return  data.filter((r) => {
      return r.count !== '0'
    })
  })


  return {
    status: 200,
    riders,
    active: 'ryttere',
    title: 'Alle ryttere : Norsk enduro'
  }
}

async function searchHandler(req, res) {
  let results = await db.search(req.body.search)

  if (results.length === 0) {
    results = await db.searchLike(req.body.search, 50)
  }

  return {
    status: 200,
    results,
    title: 'Søketreff : Norsk enduro'
  }
}

async function jsonSearchHandler(req) {
  let results = await db.search(req.query.q)

  if (results.length === 0) {
    results = await db.searchLike(req.query.q)
  }

  return results
}

async function riderHandler (req) {
  log.debug(`request for ${req.path}`)
  const rider = await db.findRider(req.params.uid)

  if (!rider.id) {
    return { status: 404}
  }

  const rawRaces = await db.raceResultsForRider(req.params.uid)
  const races = riderViewMapper(rawRaces)
  const numRaces = races.length

  const raceIds = races.map((r) => {
    return { race: r.race, class: r.class }
  })

  const ridersPerClass = await db.ridersForClassAndRace(raceIds)

  const results = races.map((r) => {
    return Object.assign(r, { count: ridersPerClass[r.race] })
  }).sort((a, b) => {
    return compareAsc(parse(b.date), parse(a.date))
  })

  const chartObject = toChartData(results)

  const { year, avg, score } = bestSeason(results)
  const startYear = results[results.length - 1].year

  return {
    status: 200,
    rider,
    numRaces,
    startYear,
    year,
    chartObject,
    avg,
    score,
    results,
    active: 'ryttere',
    title: `${rider.name} : Norsk enduro`
  }
}

function toChartData (results) {
  return JSON.stringify(results.map((e) => {
    if (e.time !== 'DNS' && e.time !== 'DNF') {
      return { x: e.date, y: e.rank, class: e.class, race: e.raceName, properDate: parse(e.date) }
    }
  }).filter((e) => {
    return typeof e !== 'undefined'
  }).sort((a, b) => {
    return compareAsc(a.properDate, b.properDate)
  }))
}


module.exports = {
  raceHandler,
  indexHandler,
  racesHandler,
  riderHandler,
  ridersHandler,
  searchHandler,
  jsonSearchHandler
}

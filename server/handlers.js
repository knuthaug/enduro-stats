const log = require('./log.js')
const Db = require('./db.js')
const resultViewMapper = require('./resultViewMapper.js')
const fullResultViewMapper = require('./fullResultViewMapper.js')
const raceViewMapper = require('./raceViewMapper.js')
const { riderViewMapper, toNumber } = require('./riderViewMapper.js')
const bestSeason = require('./bestSeason.js')
const compareAsc = require('date-fns/compare_asc')
const parse = require('date-fns/parse')
const comparisonMapper = require('./comparisonMapper.js')
const comparisonGraphMapper = require('./comparisonGraphMapper.js')
const db = new Db()

async function racesHandler (req) {
  const races = raceViewMapper(await db.findRaces())
  return {
    status: 200,
    races,
    active: 'ritt',
    title: 'Alle ritt : Norsk enduro'
  }
}

async function compareHandler (req) {
  const ridersParam = req.query.riders
  let ridersData = []
  let riders = []

  if (ridersParam) {
    ridersData = comparisonMapper(await db.raceResultsForRiders(ridersParam))
    riders = await db.findRiders(ridersParam)
  }

  const graphObject = toComparisonChartData(ridersData)

  return {
    status: 200,
    ridersData,
    riders,
    graphObject: JSON.stringify(graphObject)
  }
}

async function compareGraphHandler (req) {
  const riders = req.query.riders
  const race = req.query.race
  let ridersData = []

  if (riders) {
    ridersData = await db.raceResultsForRaceAndRiders(race, riders)
  }

  return comparisonGraphMapper(ridersData)
}

async function raceHandler (req) {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)

  if (!race.id) {
    return { status: 404 }
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

async function fullRaceHandler (req) {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)

  if (!race.id) {
    return { status: 404 }
  }

  const links = await db.findRaceLinks(race.id)
  const raceClasses = await db.classesForRace(req.params.uid)
  const raceResults = await db.raceResults(req.params.uid)
  const [stages, results] = fullResultViewMapper(raceClasses, raceResults)
  const noResults = Object.values(results).length > 0
  let message

  const riders = Array.from(new Set(raceResults.map((r) => {
    return r.uid
  })))

  if(riders.length > results.length) {
    message = 'Ryttere i klasser med færre etapper enn maksimalt antall, er filtrert ut av total-listen da de automatisk får kortest totaltid. Bruk vanlig resultatvisning for å se resultater for disse klassene.'
  }

  return {
    status: 200,
    race,
    stages,
    results,
    message,
    noResults,
    links,
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
    return data.filter((r) => {
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

async function searchHandler (req, res) {
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

async function jsonSearchHandler (req) {
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
    return { status: 404 }
  }

  const rawRaces = await db.raceResultsForRider(req.params.uid)

  if (!rawRaces.length) {
    return { status: 404, message: 'Rytteren finnes i databasen, men det fantes ingen ritt for denne rytteren (noe som tyder på en feil et sted hos oss)' }
  }

  const races = riderViewMapper(rawRaces)
  const numRaces = races.length

  const raceIds = races.map((r) => {
    return { race: r.race, class: r.class }
  })

  const ridersPerClass = await db.ridersForClassAndRace(raceIds)

  const results = percentRanks(races, ridersPerClass)

  const { placesChart, percentChart } = toChartData(results)

  const { year, avg, score } = bestSeason(results)
  const startYear = results[results.length - 1].year

  return {
    status: 200,
    rider,
    numRaces,
    startYear,
    year,
    placesChart,
    percentChart,
    avg,
    score,
    results,
    active: 'ryttere',
    title: `${rider.name} : Norsk enduro`
  }
}

function percentRanks (races, ridersPerClass) {
  return races.map((r) => {
    return Object.assign(r, { count: ridersPerClass[r.race] })
  }).map((r) => {
    r.details = r.details.map((d) => {
      d.percent_rank = (d.rank / r.count) * 100
      return d
    })

    r.chartData = JSON.stringify(r.details.map((e) => {
      return [ toNumber(e.name), e.percent_rank ]
    }))

    // avg for percent_rank
    r.avg_percent_rank = r.details.reduce((acc, cur) => {
      return acc + cur.percent_rank
    }, 0) / r.details.length

    return r
  }).sort((a, b) => {
    return compareAsc(parse(b.date), parse(a.date))
  })
}

function toComparisonChartData(races) {
  const ridersSeries = {}

  for(let i = 0; i < races.length; i++) {
    for(let j = 0; j < races[i].riders.length; j++) {
      const rider = races[i].riders[j]
      if(!ridersSeries.hasOwnProperty(rider.name)) {
        ridersSeries[rider.name] = []
      }
      ridersSeries[rider.name].push([
        races[i].name,
        races[i].riders[j].acc_time_ms
      ])
    }
  }

  return Object.keys(ridersSeries).map((key) => {
    return {
      name: key,
      data: ridersSeries[key]
    }
  })
}

function toChartData (results) {
  const placesChart = JSON.stringify(results.map((e) => {
    if (e.time !== 'DNS' && e.time !== 'DNF') {
      return { x: e.date, y: e.rank, class: e.class, race: e.raceName, properDate: parse(e.date) }
    }
  }).filter((e) => {
    return typeof e !== 'undefined'
  }).sort((a, b) => {
    return compareAsc(a.properDate, b.properDate)
  }))

  const percentChart = JSON.stringify(results.map((e) => {
    if (e.time !== 'DNS' && e.time !== 'DNF') {
      return { x: e.date, y: ((e.rank / e.count) * 100), class: e.class, race: e.raceName, properDate: parse(e.date) }
    }
  }).filter((e) => {
    return typeof e !== 'undefined'
  }).sort((a, b) => {
    return compareAsc(a.properDate, b.properDate)
  }))

  return { placesChart, percentChart }
}

module.exports = {
  raceHandler,
  fullRaceHandler,
  indexHandler,
  racesHandler,
  riderHandler,
  ridersHandler,
  searchHandler,
  jsonSearchHandler,
  compareHandler,
  compareGraphHandler
}

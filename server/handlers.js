const log = require('./log')
const Db = require('./db')
const resultViewMapper = require('./resultViewMapper')
const fullResultViewMapper = require('./fullResultViewMapper')
const raceViewMapper = require('./raceViewMapper.js')
const { riderViewMapper } = require('./riderViewMapper')
const compareAsc = require('date-fns/compare_asc')
const parse = require('date-fns/parse')
const { percentRanks } = require('../lib/percent_ranks')

const comparisonMapper = require('./comparisonMapper')
const comparisonGraphMapper = require('./comparisonGraphMapper')
const db = new Db()

async function manifestHandler (req) {
  return {
    name: 'Norsk enduro'
  }
}

async function mapHandler (req) {
  if (!req.params.uid) {
    return { status: 404 }
  }

  const race = await db.findRace(req.params.uid)
  const stageDetails = await db.stageDetails(req.params.uid)

  if (!race.lat) {
    return { status: 404 }
  }

  const data = {
    center: [race.lat, race.long],
    zoom: race.zoom || 14,
    stageDetails
  }

  if (!race.id) {
    return { status: 404 }
  }
  return {
    status: 200,
    race,
    gpxData: JSON.stringify(data),
    title: `Kart ${race.name}: Norsk enduro`,
    docTitle: `Etappedetaljer for ${race.name}`,
    description: 'Resultater, statistikk og informasjon om ritt og ryttere i norske enduroritt.',
    map: true
  }
}

async function racesHandler (req) {
  const races = raceViewMapper(await db.findRaces())
  return {
    status: 200,
    races,
    active: 'ritt',
    docTitle: 'Alle ritt : Norsk enduro'
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
    docTitle: 'Sammenligne ryttere : Norsk enduro',
    graphObject: JSON.stringify(graphObject)
  }
}

async function compareGraphHandler (req) {
  const riders = req.query.riders
  const race = req.query.race
  const type = req.query.type

  if (!riders) {
    return []
  }

  const ridersData = await db.raceResultsForRaceAndRiders(race, riders)

  if (type === 'places') {
    return comparisonGraphMapper.places(ridersData)
  }

  if (type === 'times') {
    return comparisonGraphMapper.timeBehind(ridersData)
  }

  if (type === 'acc-times') {
    return comparisonGraphMapper.accTimeBehind(ridersData)
  }

  return []
}

async function raceHandler (req) {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)

  if (!race.id) {
    return { status: 404 }
  }

  const links = await db.raceLinks(race.id)
  const raceClasses = await db.classesForRace(req.params.uid)
  const raceResults = await db.raceResults(req.params.uid)
  const [stages, results, graphs] = resultViewMapper(raceClasses, raceResults)
  const noResults = Object.values(results).length > 0

  const sortedClasses = Object.keys(results).sort()

  Object.keys(graphs).forEach((cl) => {
    graphs[cl] = JSON.stringify(graphs[cl])
  })

  return {
    status: 200,
    race,
    backdrop: true,
    stages,
    results,
    links,
    graphs,
    sortedClasses,
    noResults,
    active: 'ritt',
    docTitle: `${race.name} ${race.year} : Norsk enduro`,
    description: `Resultater og statistikk for ${race.name} ${race.year}`
  }
}

async function fullRaceHandler (req) {
  log.debug(`request for ${req.path}`)
  const race = await db.findRace(req.params.uid)

  if (!race.id) {
    return { status: 404 }
  }

  const links = await db.raceLinks(race.id)
  const raceClasses = await db.classesForRace(req.params.uid)
  const raceResults = await db.raceResults(req.params.uid)
  const [stages, results] = fullResultViewMapper(raceClasses, raceResults)
  const noResults = Object.values(results).length > 0
  let message

  const riders = Array.from(new Set(raceResults.map((r) => {
    return r.uid
  })))

  if (riders.length > results.length) {
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
    docTitle: `${race.name} ${race.year} : Norsk enduro`
  }
}

async function calendarHandler () {
  return {
    status: 200,
    active: 'cal',
    title: 'Rittkalender 2020',
    docTitle: 'Norsk enduro: Rittkalender for sesongen 2020',
    description: 'Rittkalender for sesongen 2020'
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
    docTitle: 'Norsk enduro',
    description: 'Resultater, statistikk og informasjon om ritt og ryttere i norske enduroritt.'
  }
}

async function rankHandler (req) {
  log.debug(`request for ${req.path}`)
  const men = await db.riderRanks('M')
  const women = await db.riderRanks('F')
  return {
    status: 200,
    men,
    women,
    active: 'rank',
    docTitle: 'Rytter-ranking : Norsk enduro'
  }
}

async function ridersHandler (req) {
  const riders = await db.findAllRiders().then((data) => {
    return data.filter((r) => {
      return r.count !== '0'
    })
  })

  return {
    status: 200,
    riders,
    active: 'ryttere',
    docTitle: 'Alle ryttere : Norsk enduro'
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
    docTitle: 'Søketreff : Norsk enduro'
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

  const { year, avg, score } = await db.riderRanking(rider.id)
  const startYear = results[results.length - 1].year

  return {
    status: 200,
    rider,
    numRaces,
    startYear,
    year,
    portrait: rider.image_mode === 'portrait',
    placesChart,
    percentChart,
    avg,
    score,
    results,
    active: 'ryttere',
    docTitle: `${rider.name} : Norsk enduro`,
    description: `Ritt-historikk for ${rider.name}, ${rider.club}`
  }
}

function toComparisonChartData (races) {
  const ridersSeries = {}

  for (let i = 0; i < races.length; i++) {
    for (let j = 0; j < races[i].riders.length; j++) {
      const rider = races[i].riders[j]
      if (!ridersSeries[rider.name]) {
        ridersSeries[rider.name] = []
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
      return {
        x: e.date,
        y: e.rank,
        class: e.class,
        race: e.raceName,
        properDate: parse(e.date)
      }
    }
  }).filter((e) => {
    return typeof e !== 'undefined'
  }).sort((a, b) => {
    return compareAsc(a.properDate, b.properDate)
  }))

  const percentChart = JSON.stringify(results.map((e) => {
    if (e.time !== 'DNS' && e.time !== 'DNF') {
      return {
        x: e.date,
        y: ((e.rank / e.count) * 100),
        class: e.class,
        race: e.raceName,
        properDate: parse(e.date)
      }
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
  compareGraphHandler,
  rankHandler,
  manifestHandler,
  mapHandler,
  calendarHandler
}

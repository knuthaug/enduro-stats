const md5 = require('md5')
const Db = require('./db.js')
const Eq = require('./converters/eq.js')
const Mylaps = require('./converters/mylaps.js')
const Sportident = require('./converters/sportident.js')
const fs = require('fs')
const afs = require('await-fs')
const path = require('path')
const AccumulatedStageCalculations = require('./accumulated_stage_calculations.js')
const NormalStageCalculations = require('./normal_stage_calculations.js')
const logger = require('./logger.js')
const cmd = require('command-line-args')
const { allRidersRankings } = require('../lib/ranking')

const db = new Db()
const accCalc = new AccumulatedStageCalculations()
const normalCalc = new NormalStageCalculations()

const optionDefinitions = [
  { name: 'accumulate', alias: 'a', type: Boolean },
  { name: 'dir', alias: 'd', type: String },
  { name: 'mylaps', alias: 'm', type: Boolean },
  { name: 'sportident', alias: 's', type: Boolean },
  { name: 'file', alias: 'f', type: String },
  { name: 'racedata', alias: 'r', type: String }
]

const options = cmd(optionDefinitions)

options.mode = 'eq'

if (!options.hasOwnProperty('accumulate')) {
  options.accumulate = false
}

if (options.hasOwnProperty('mylaps')) {
  options.mode = 'mylaps'
}

if (options.hasOwnProperty('sportident')) {
  options.mode = 'sportident'
}

if (!options.hasOwnProperty('dir') && !options.hasOwnProperty('file') && !options.hasOwnProperty('racedata')) {
  console.log('Usage: [-a] -d path/to/directory || -f path/to/file')
  process.exit(-1)
}

const dir = options.dir
if (dir) {
  fs.readdir(dir, async function (err, items) {
    let raceName, raceYear, raceId, raceDate
    for (var i = 0; i < items.length; i++) {
      let { raceName, raceYear, raceId, raceDate } = await readSingleStageFile(items[i])
    }

    const classes = await db.classesForRace(raceId)
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].class === 'Lag Rekrutt') {
        continue
      }

      logger.info(`Reading back results for race ${raceName}, year=${raceYear}, class=${classes[i].class}`)
      const results = await db.rawRaceResults(raceName, raceYear, classes[i].class)
      logger.debug(`got ${results.length} rows`)

      let calcs
      if (options.accumulate) {
        calcs = await accCalc.differentials(results, options)
      } else {
        calcs = await normalCalc.differentials(results, options)
      }

      await db.insertCalculatedResults(raceId, calcs)
    }

    const allRiders = await db.findAllRiders().then((data) => {
      return data.filter((r) => {
        return r.count !== '0'
      })
    })

    await calculateRankings(allRiders, raceYear, raceId, raceDate)

    db.destroy()
  })
}

// single file results
if (options.file) {
  const dirNameParts = options.file.split(/\//)
  const dirName = dirNameParts.slice(0, dirNameParts.length - 1).join('/')
  calculateComplete(dirName)
}

if (options.racedata) {
  readRaceData(options.racedata)
}

async function readRaceData (file) {
  const stats = await afs.stat(file)

  if (stats.isFile()) {
    logger.info(`reading data file ${file} for extra data`)
    const datafile = await afs.readFile(file, 'utf-8')
    const data = JSON.parse(datafile)
    data.uid = md5(data.name + data.year)
    const raceId = await db.insertRace(data, 0)

    if (data.hasOwnProperty('links')){
      await db.insertRaceLinks(raceId, data.links)
    }
  } else {
    logger.error(`Data file ${file} was not found`)
  }
}

async function calculateComplete (dirName) {
  const { raceName, raceYear, raceId, raceDate } = await readCompleteRaceFile(options.file, path.join(dirName, 'racedata.json'), options.mode)

  const classes = await db.classesForRace(raceId)
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].class === 'Lag Rekrutt' || classes[i].class === 'Boys 12-17') {
      continue
    }

    logger.info(`Reading back results for race ${raceName}, year=${raceYear}, class=${classes[i].class}`)
    const results = await db.rawRaceResults(raceName, raceYear, classes[i].class)
    logger.debug(`got ${results.length} rows`)

    let calcs
    if (options.accumulate) {
      calcs = await accCalc.differentials(results, options)
    } else {
      calcs = await normalCalc.differentials(results, options)
    }

    // console.log(calcs)
    await db.insertCalculatedResults(raceId, calcs)
  }

  const allRiders = await db.findAllRiders().then((data) => {
    return data.filter((r) => {
      return r.count !== '0'
    })
  })
  await calculateRankings(allRiders, raceYear, raceId, raceDate)

  db.destroy()
}

async function calculateRankings (riders, year, raceId, raceDate) {
  await allRidersRankings(riders, year, raceId, raceDate)
}

async function readCompleteRaceFile (filename, datafile, mode) {
  let data = {}
  let parser
  if (mode === 'eq') {
    parser = new Eq(filename, { mode: 'complete', datafile, acc: options.accumulate })
  } else if(mode === 'mylaps'){
    parser = new Mylaps(filename, { datafile })
  } else if(mode === 'sportident'){
    parser = new Sportident(filename, { datafile })
  }

  await parser.load()
  data = await parser.parse()

  let raceId

  for (let i = 0; i < data.stages.length; i++) {
    raceId = await db.insertRace(data.race, data.stages[i].number)
    await db.insertStage(data.race.name, data.stages[i], raceId)
    await db.insertRawResults(data.race.name, data.race.year, data.stages[i], data.stages[i].results)
  }

  if (data.race.hasOwnProperty('links')) {
    db.insertRaceLinks(raceId, data.race.links)
  }

  return { raceName: data.race.name, raceYear: data.race.year, raceId: raceId, raceDate: data.race.date }
}

async function readSingleStageFile (filename) {
  const fullName = path.join(dir, filename)
  const eq = new Eq(fullName, { mode: 'normal', acc: options.accumulate })
  await eq.load()
  const data = await eq.parse()
  const raceId = await db.insertRace(data.race, data.stages[0].number)
  await db.insertStage(data.race.name, data.stages[0], raceId)
  await db.insertRawResults(data.race.name, data.race.year, data.stages[0], data.stages[0].results)
  return { raceName: data.race.name, raceYear: data.race.year, raceId: raceId, raceDate: data.race.date }
}

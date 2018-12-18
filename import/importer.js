const Db = require('./db.js')
const Eq = require('./converters/eq.js')
const fs = require('fs')
const path = require('path')
const AccumulatedStageCalculations = require('./accumulated_stage_calculations.js')
const NormalStageCalculations = require('./normal_stage_calculations.js')
const logger = require('./logger.js')
const cmd = require('command-line-args')

const db = new Db()
const accCalc = new AccumulatedStageCalculations()
const normalCalc = new NormalStageCalculations()

const optionDefinitions = [
  { name: 'accumulate', alias: 'a', type: Boolean },
  { name: 'dir', alias: 'd', type: String },
  { name: 'file', alias: 'f', type: String }
]

const options = cmd(optionDefinitions)

if (!options.hasOwnProperty('accumulate')) {
  options.accumulate = false
}

if (!options.hasOwnProperty('dir') && !options.hasOwnProperty('file')) {
  console.log('Usage: [-a] -d path/to/directory || -f path/to/file')
  process.exit(-1)
}

const dir = options.dir
if (dir) {
  fs.readdir(dir, async function (err, items) {
    let values = []
    for (var i = 0; i < items.length; i++) {
      values = await readSingleStageFile(items[i])
    }

    // console.log(`race=${values[0]}, year=${values[1]}`)
    const raceId = await db.findRace(values[0], values[1])

    const classes = await db.classesForRace(raceId)
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].class === 'Lag Rekrutt') {
        continue
      }

      logger.info(`Reading back results for race ${values[0]}, year=${values[1]}, class=${classes[i].class}`)
      const results = await db.rawRaceResults(values[0], values[1], classes[i].class)
      logger.debug(`got ${results.length} rows`)

      let calcs
      if (options.accumulate) {
        calcs = await accCalc.differentials(results, options)
      } else {
        calcs = await normalCalc.differentials(results, options)
      }

      await db.insertCalculatedResults(raceId, calcs)
    }

    db.destroy()
  })
}

// single file results
if (options.file) {
  const dirNameParts = options.file.split(/\//)
  const dirName = dirNameParts.slice(0, dirNameParts.length - 1).join('/')
  calculateComplete(dirName)
}

async function calculateComplete (dirName) {
  const meta = await readCompleteRaceFile(options.file, path.join(dirName, 'racedata.json'))
  const raceId = await db.findRace(meta[0], meta[1])

  const classes = await db.classesForRace(raceId)
  for (let i = 0; i < classes.length; i++) {
    logger.info(`Reading back results for race ${meta[0]}, year=${meta[1]}, class=${classes[i].class}`)
    const results = await db.rawRaceResults(meta[0], meta[1], classes[i].class)
    logger.debug(`got ${results.length} rows`)

    let calcs
    if (options.accumulate) {
      calcs = await accCalc.differentials(results, options)
    } else {
      calcs = await normalCalc.differentials(results, options)
    }

    console.log(calcs)
    // await db.insertCalculatedResults(raceId, calcs)
  }
  db.destroy()
}

async function readCompleteRaceFile (filename, datafile) {
  const eq = new Eq(filename, { mode: 'complete', datafile })
  await eq.load()
  const data = await eq.parse({ acc: options.accumulate })
  // console.log(data.stages[0].results)
  for (let i = 0; i < data.stages.length; i++) {
    const raceId = await db.insertRace(data.race, data.stages[i].number)
    await db.insertStage(data.race.name, data.stages[i], raceId)
    await db.insertRawResults(data.race.name, data.race.year, data.stages[i], data.stages[i].results)
  }
  return [data.race.name, data.race.year]
}

async function readSingleStageFile (filename) {
  const fullName = path.join(dir, filename)
  const eq = new Eq(fullName, { mode: 'normal' })
  await eq.load()
  const data = await eq.parse({ acc: options.accumulate })
  const raceId = await db.insertRace(data.race, data.stages[0].number)
  await db.insertStage(data.race.name, data.stages[0], raceId)
  await db.insertRawResults(data.race.name, data.race.year, data.stages[0], data.stages[0].results)
  return [data.race.name, data.race.year]
}

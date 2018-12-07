const Db = require('./db.js')
const Eq = require('./converters/eq.js')
const fs = require('fs')
const path = require('path')
const StageCalculations = require('./stage_calculations.js')
const logger = require('./logger.js')
const cmd = require('command-line-args')

const db = new Db()
const calc = new StageCalculations()

const optionDefinitions = [
  { name: 'accumulate', alias: 'a', type: Boolean },
  { name: 'dir', alias: 'd', type: String }
]

const options = cmd(optionDefinitions)

if (!options.hasOwnProperty('accumulate')) {
  options.accumulate = false
}

if (!options.hasOwnProperty('dir')) {
  console.log('Usage: [-a] -f path/to/directory')
  process.exit(-1)
}

const dir = options.dir
fs.readdir(dir, async function (err, items) {
  let values = []
  for (var i = 0; i < items.length; i++) {
    values = await readFile(items[i])
  }

  // console.log(`race=${values[0]}, year=${values[1]}`)
  const id = await db.findRace(values[0], values[1])

  const classes = await db.classesForRace(id)
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].class === 'Lag Rekrutt') {
      continue
    }

    logger.info(`Reading back results for race ${values[0]}, year=${values[1]}, class=${classes[i].class}`)
    const results = await db.rawRaceResults(values[0], values[1], classes[i].class)
    logger.debug(`got ${results.length} rows`)

    if (options.accumulate) {
      const calcs = await calc.differentials(results, id)
      await db.insertCalculatedResults(id, calcs)
    } else {
      console.log('Not calculating yet because of lack of support')
    }
  }

  db.destroy()
})

async function readFile (filename) {
  const fullName = path.join(dir, filename)
  const eq = new Eq(fullName)
  await eq.load()
  const data = await eq.parse({ acc: options.accumulate })
  const raceId = await db.insertRace(data.race)
  await db.insertStage(data.race.name, data.stage, raceId)
  await db.insertRawResults(data.race.name, data.race.year, data.stage, data.results)
  return [data.race.name, data.race.year]
}

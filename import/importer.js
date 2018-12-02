const Db = require('./db.js')
const Eq = require('./converters/eq.js')
const fs = require('fs')
const path = require('path')
const StageCalculations = require('./stage_calculations.js')
const logger = require('./logger.js')

const db = new Db()
const calc = new StageCalculations()
if (process.argv.length <= 2) {
  console.log('Usage: ' + __filename + ' path/to/directory')
  process.exit(-1)
}

const dir = process.argv[2]
fs.readdir(dir, async function (err, items) {
  let values = []
  for (var i = 0; i < items.length; i++) {
    const eq = new Eq()
    values = await readFile(items[i])
  }

  //console.log(`race=${values[0]}, year=${values[1]}`)
  const id = await db.findRace(values[0], values[1])
  //console.log('raceid = ' + id)
  logger.info(`Reading back results for race ${values[0]}, year=${values[1]}`)
  const results = await db.rawRaceResults(values[0], values[1], 'Menn')
  //console.log(results)
  const calcs = await calc.differentials(results, id)
  //console.log(calcs)
  await db.insertCalculatedResults(id, calcs)

  db.destroy()
})

async function readFile (filename) {
  const fullName = path.join(dir, filename)
  const eq = new Eq(fullName)
  await eq.load()
  const data = await eq.parse()
  await db.insertRace(data.race)
  const stageId = await db.insertStage(data.race.name, data.stage, data.race.year)
  await db.insertRawResults(data.race.name, data.race.year, data.stage, data.results)
  return [data.race.name, data.race.year]
}

const Db = require('./db.js')
const Eq = require('./converters/eq.js')
const fs = require('fs')
const path = require('path')
const StageCalculations = require('./stage_calculations.js')

const db = new Db()
const calc = new StageCalculations()
if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " path/to/directory")
  process.exit(-1)
}

const dir = process.argv[2]
fs.readdir(dir, async function(err, items) {
  for (var i=0; i<items.length; i++) {
    const eq = new Eq()
    await readFile(items[i])
  }
  db.destroy()
})


async function readFile(filename) {
  const fullName = path.join(dir, filename)
  const eq = new Eq(fullName)
  await eq.load()
  const data = await eq.parse()
  await db.insertRace(data.race)
  const stageId = await db.insertStage(data.race.name, data.stage, data.race.year)
  await db.insertResults(data.race.name, data.race.year, data.stage, data.results)

  const id = await db.findRace(data.race.name, data.race.year)
  console.log('raceid = ' + id)
  const results = await db.raceResults(data.race.name, data.race.year, 'Menn', stageId)
  console.log(results)
  //const calcs = await calc.differentials(results, id)
  //console.log(calcs)
  //await db.insertCalculatedResult(id, calcs)


}

const Db = require('./db.js')
const Eq = require('./converters/eq.js')
const fs = require('fs')
const path = require('path')

const db = new Db()

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
  await db.insertStage(data.race.name, data.stage)
}

const Db = require('../server//db.js')

const db = new Db()

call()

async function call () {
  const results = await db.raceResults('31eb869b806338e8cc986f6711e80599')
  // const results = await db.findRaces()
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

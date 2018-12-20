const Db = require('../server/db.js')

const db = new Db()

call()

async function call () {
  const results = await db.raceResultsForRider('603fb3e38346461ff2ba9ac4c35ff7fb')
  // const results = await db.findRaces()
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

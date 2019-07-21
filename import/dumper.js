const Db = require('../import/db.js')

const db = new Db()

call()

async function call () {
  const results = await db.rawRaceResults('DrammEnduro', 2019, 'Menn master')
  // const results = await db.findRaces()
  // const results = await db.raceResultsForRiders(['16aa245876cc35048a730591c11d7f65', 'e3fdd33aa6dc207cb5c2b2ec7308bff1'])
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

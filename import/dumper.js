const Db = require('../server/db.js')

const db = new Db()

call()

async function call () {
  const results = await db.raceResultsForRider('e3fdd33aa6dc207cb5c2b2ec7308bff1')
  // const results = await db.findRaces()
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

const Db = require('../import/db.js')

const db = new Db()

call()

async function call () {
  const results = await db.rawRaceResults('Oslo enduro', 2013, 'Menn senior')
  //const results = await db.findRaces()
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

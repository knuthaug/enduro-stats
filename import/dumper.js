const Db = require('../import/db.js')

const db = new Db()

call()

async function call () {
  const results = await db.rawRaceResults('Traktor enduro', '2017', 'Kvinner senior')
  // const results = await db.findRaces()
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

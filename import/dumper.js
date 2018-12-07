const Db = require('../import/db.js')

const db = new Db()

call()

async function call () {
  const results = await db.rawRaceResults('80/20 TraktorEnduro', 2015, 'Menn senior')
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

const Db = require('../import/db.js')

const db = new Db()

call()

async function call () {
  const results = await db.rawRaceResults('NesbyEnduro 80twenty', 2014, 'Menn junior')
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

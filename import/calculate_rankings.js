const Db = require('../server/db')
const { allRidersRankings } = require('../lib/ranking')

const db = new Db()

async function run() {
  const allRiders = await db.findAllRiders().then((data) => {
    return data.filter((r) => {
      return r.count !== '0'
    })
  })
  allRidersRankings(allRiders)
  //allRidersRankings([{id: 1684, uid: 'b3656cd8d7f6f243683f1c52d32cf4e1'}])
}

run()

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
  //allRidersRankings([{id: 5730, uid: '00fde8e308a30a453c1f22e9bf8600a8'}])
}

run()

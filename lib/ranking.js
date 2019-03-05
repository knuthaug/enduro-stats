const Db = require('../server/db')
const ImportDb = require('../import/db')
const { convertTimeToMs } = require('../lib/time.js')
const { riderViewMapper, toNumber } = require('../server//riderViewMapper')
const compareAsc = require('date-fns/compare_asc')
const parse = require('date-fns/parse')

const db = new Db()
const importDb = new ImportDb()

async function allRidersRankings(riders) {
  let i = 1
  riders.forEach(async (rider) => {
    const rawRaces = await db.raceResultsForRider(rider.uid)
    const races = riderViewMapper(rawRaces)
    const raceIds = races.map((r) => {
      return { race: r.race, class: r.class }
    })

    const ridersPerClass = await db.ridersForClassAndRace(raceIds)
    const results = percentRanks(races, ridersPerClass)
    const { year, avg, score } = userRanking(results)
    console.log(`${rider.name}: best year:${year}, score:${score}`)
    importDb.addRankings(rider.id, year, avg, score)
  })
}

function percentRanks (races, ridersPerClass) {
  return races.map((r) => {
    return Object.assign(r, { count: ridersPerClass[r.race] })
  }).map((r) => {
    r.details = r.details.map((d) => {
      d.percent_rank = (d.rank / r.count) * 100
      return d
    })

    r.chartData = JSON.stringify(r.details.map((e) => {
      return [ toNumber(e.name), e.percent_rank ]
    }))

    // avg for percent_rank
    r.avg_percent_rank = r.details.reduce((acc, cur) => {
      return acc + cur.percent_rank
    }, 0) / r.details.length

    return r
  }).sort((a, b) => {
    return compareAsc(parse(b.date), parse(a.date))
  })
}

function userRanking(rows) {
  const years = { }
  const scores = []
  const thisYear = new Date().getFullYear()

  for (let i = 0; i < rows.length; i++) {
    if (!years.hasOwnProperty(rows[i].year)) {
      years[rows[i].year] = []
    }

    if (rows[i].time_behind !== 'DNS' && rows[i].time_behind !== 'DNF') {
      years[rows[i].year].push(rows[i].rank)
      if(rows[i].rank !== 1 || (rows[i].rank / rows[i].count) < 1) {
        const totalTime = convertTimeToMs(rows[i].time)
        const winnerTime = totalTime - convertTimeToMs(rows[i].time_behind)
        const diffTime = convertTimeToMs(rows[i].time_behind)
        //console.log(`total:${totalTime}: winnerTime:${winnerTime}`)
        if(thisYear - rows[i].year < 4) {
          scores.push((diffTime / winnerTime) * 100)
        }
      }
    }
  }

  const avgs = {}
  Object.keys(years).forEach((y) => {
    const a = years[y].reduce((a, b) => {
      return a + b
    }, 0) / years[y].length
    avgs[y] = {}
    avgs[y].sum = years[y].length - a
    avgs[y].avg = a
  })

  let max = -1000
  let year = 2000
  const keys = Object.keys(avgs)
  for (let i = 0; i < keys.length; i++) {
    if (avgs[keys[i]].sum > max) {
      max = avgs[keys[i]].sum
      year = keys[i]
    }
  }

  if (year === 2000) {
    return { year: 0, avg: 0 }
  }

  console.log(scores)
// score is average percent behind winner in class
  let score = scores.reduce((acc, cur) => {
    return acc + cur
  }, 0) / scores.length

  // add baseline 20
  score += 20

  // add 5 for each race below 5
  if(scores.length < 5) {
    score += (5 - scores.length) * 5
  }

  // only one race, add 200
  if(scores.length === 1) {
    score += 200
  }

  if(scores.length === 0) {
    score = 1000
  }

  return { year, avg: parseFloat(avgs[year].avg, 10).toFixed(1), score: score.toFixed(2) }
}

module.exports = {
  userRanking,
  allRidersRankings,
  percentRanks
}

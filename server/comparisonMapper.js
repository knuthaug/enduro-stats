const { convertMsToTime } = require('../lib/time.js')
const compareDesc = require('date-fns/compare_desc')
const parse = require('date-fns/parse')

module.exports = function comparisonMapper (data) {
  // races for each rider

  const riderSet = Array.from(new Set(data.map(d => d.uid)))

  const riders = riderSet.map((uid) => {
    const rider = data.find((d) => {
      return d.uid === uid
    })
    return { name: rider.name, uid: rider.uid, class: rider.class }
  })

  const racesPerRider = riders.map((rider) => {
    return {
      uid: rider.uid,
      races: data.filter(d => {
        return d.uid === rider.uid && d.final_rank !== null
      }).map(r => r.race_uid)
    }
  })

  var sets = racesPerRider.map((r) => {
    return r.races
  })

  var intersection = sets.reduce(intersect)

  return intersection.map(r => {
    let race = data.find(d => d.race_uid === r)
    race = {
      uid: race.race_uid,
      date: race.date,
      year: race.year,
      name: `${race.race_name} ${race.year}`
    }

    const raceResults = data.filter(d => d.race_uid === race.uid)

    const raceResultsForRiders = riders.map(rider => {
      const finalStage = raceResults.find(r => r.uid === rider.uid && r.final_rank !== null)

      return {
        name: rider.name,
        class: finalStage.class,
        uid: rider.uid,
        final_rank: finalStage.final_rank,
        final_status: finalStage.final_status,
        total_time: convertMsToTime(finalStage.acc_time_ms),
        acc_time_ms: finalStage.acc_time_ms,
        stages: raceResults.filter((r) => {
          return r.uid === rider.uid
        }).map(d => {
          return {
            stage: d.stage,
            rank: d.stage_rank,
            stage_time_ms: d.stage_time_ms,
            time: convertMsToTime(d.stage_time_ms),
            stage_status: d.status,
            final_rank: d.final_rank,
            acc_time_ms: d.acc_time_ms
          }
        })
      }
    })

    return {
      uid: r,
      name: race.name,
      date: race.date,
      stages: raceResultsForRiders[0].stages.map(r => r.stage),
      riders: raceResultsForRiders
    }
  }).sort((a, b) => compareDesc(parse(a.date), parse(b.date)))
}

function intersect (a, b) {
  var t
  if (b.length > a.length) {
    t = b
    b = a
    a = t
  }

  return a
    .filter(e => b.indexOf(e) > -1)
    .filter((e, i, c) => c.indexOf(e) === i)
}

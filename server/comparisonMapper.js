const { convertMsToTime } = require('../lib/time.js')
const compareDesc = require('date-fns/compare_desc')
const parse = require('date-fns/parse')

module.exports = function comparisonMapper (data) {
  // races for each rider

  const riderSet = Array.from(new Set(data.map((d) => {
    return d.rider_uid
  })))

  const riders = riderSet.map((uid) => {
    const rider = data.find((d) => {
      return d.rider_uid === uid
    })

    return { rider_name: rider.rider_name, rider_uid: rider.rider_uid }
  })

  const racesPerRider = riders.map((rider) => {
    return {
      uid: rider.rider_uid,
      races: data.filter((d) => {
        return d.rider_uid === rider.rider_uid && d.final_rank !== null
      }).map((r) => {
        return r.uid
      })
    }
  })

  var sets = racesPerRider.map((r) => {
    return r.races
  })

  var intersection = sets.reduce(intersect)

  return intersection.map((r) => {
    let race = data.find((d) => {
      return d.uid === r
    })
    race = {
      uid: race.uid,
      date: race.date,
      year: race.year,
      name: `${race.name} ${race.year}`
    }

    const raceResults = data.filter((d) => {
      return d.uid === race.uid
    })

    const raceResultsForRiders = riders.map((rider) => {
      const finalStage = raceResults.find((r) => {
        return r.rider_uid === rider.rider_uid && r.final_rank !== null
      })

      return {
        name: rider.rider_name,
        rider_uid: rider.rider_uid,
        final_rank: finalStage.final_rank,
        final_status: finalStage.final_status,
        total_time: convertMsToTime(finalStage.acc_time_ms),
        stages: raceResults.filter((r) => {
          return r.rider_uid === rider.rider_uid
        }).map((d) => {
          return {
            stage: d.stage,
            rank: d.stage_rank,
            stage_time_ms: d.stage_time_ms,
            time: d.time,
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
      stages: raceResultsForRiders[0].stages.map((r) => {
        return r.stage
      }),
      riders: raceResultsForRiders
    }
  }).sort((a, b) => {
    return compareDesc(parse(a.date), parse(b.date))
  })
}

function intersect (a, b) {
  var t
  if (b.length > a.length) {
    t = b
    b = a
    a = t
  }

  return a.filter(function (e) {
    return b.indexOf(e) > -1
  }).filter(function (e, i, c) {
    return c.indexOf(e) === i
  })
}

const { convertMsToTime, convertTimeToMs } = require('../lib/time.js')

module.exports = function fullResultViewMapper (classes, results) {
  const out = {}
  let riders = {}
  let stages = []
  const lastStage = results.reduce((acc, current) => {
    return current.stage > acc ? current.stage : acc
  }, 0)

  for (let i = 0; i < results.length; i++) {
    const rider = results[i].rider_id

    if (!stages.find((s) => {
      return s === results[i].stage
    })) {
      stages.push(results[i].stage)
    }

    if (!riders.hasOwnProperty(rider)) {
      riders[rider] = {}
    }

    // fill rider object with values
    riders[rider].uid = results[i].uid
    riders[rider].name = results[i].name
    riders[rider].class = results[i].class
    riders[rider].rider_id = results[i].rider_id
    riders[rider][`stage${results[i].stage}_time`] = time(results[i].stage_time_ms, results[i].status)
    riders[rider][`stage${results[i].stage}_time_ms`] = results[i].stage_time_ms

    if (results[i].stage === lastStage) {
      riders[rider]['acc_time'] = convertMsToTime(results[i].acc_time_ms)
      riders[rider]['acc_time_ms'] = results[i].acc_time_ms
      riders[rider]['final_status'] = results[i].final_status
    }
  }

  stages = stages.sort((a, b) => {
    return a - b
  })

  riders = Object.values(riders)

  //go through stage by stage, and assign new stage ranks
  for(let i = 1; i <= lastStage; i++) {
    let rank = 1
    const sortedByStage = riders.sort((a, b) => {
      if(a[`stage${i}_time_ms`] === 0) {
        return 1
      }

      if(b[`stage${i}_time_ms`] === 0) {
        return -1
      }

      if (a[`stage${i}_time_ms`] < b[`stage${i}_time_ms`]) {
        return -1
      } else if (a[`stage${i}_time_ms`] > b[`stage${i}_time_ms`]) {
        return 1
      }
      return 0
    })

    for(let j = 0; j < sortedByStage.length; j++) {
      if(j === 0) {
        sortedByStage[j][`stage${i}_behind_leader`] = convertMsToTime(0)
      } else {
        sortedByStage[j][`stage${i}_behind_leader`] = convertMsToTime(sortedByStage[j][`stage${i}_time_ms`] - sortedByStage[0][`stage${i}_time_ms`])
      }
      sortedByStage[j][`stage${i}_rank`] = rank++
    }
    riders = sortedByStage
  }

  let i = 1
  //sort by total time and assign new total rank
  riders = Object.values(riders)
    .sort(compareTimes)
    .map((r) => {
      return Object.assign({ fullrank: i++}, r)
    })

  return [stages, riders]
}

function time (time, status) {
  if (time === 0) {
    return status
  }
  return convertMsToTime(time)
}
 
function compareTimes (a, b) {
  if(a.acc_time_ms === 0) {
    return 1
  }

  if(b.acc_time_ms === 0) {
    return -1
  }

  if (a.acc_time_ms < b.acc_time_ms) {
    return -1
  } else if (a.acc_time_ms > b.acc_time_ms) {
    return 1
  }
  return 0
}

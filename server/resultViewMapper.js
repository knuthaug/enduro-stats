const { convertMsToTime } = require('../lib/time.js')

module.exports = function resultViewMapper(classes, results) {
  const out = {}
  const riders = {}

  const lastStage = results.reduce((acc, current) => {
    return current.stage > acc ? current.stage : acc
  }, 0)

  for(let i = 0; i < results.length; i++) {
    const rider = results[i].rider_id
    if(!riders.hasOwnProperty(rider)) {
      riders[rider] = {}
    }

    //fill rider object with values
    riders[rider].rank = results[i].rank
    riders[rider].class = results[i].class
    riders[rider].rider_id = results[i].rider_id
    riders[rider][`stage${results[i].stage}_time`] = convertMsToTime(results[i].stage_time_ms)
    riders[rider][`stage${results[i].stage}_rank`] = results[i].stage_rank

    if(results[i].stage === lastStage) {
      //last stage, add in acc_time_behind
      riders[rider]['acc_time_behind'] = convertMsToTime(results[i].acc_time_behind)
    }
  }

  for(let i = 0; i < classes.length; i++) {
    out[classes[i]] = Object.values(riders).filter((r) => {
      return r.class === classes[i]
    }).sort(compareRank)
  }

  return out
}

function compareRank(a, b) {
  if (a.rank < b.rank) {
    return -1
  } else if (a.rank > b.rank) {
    return 1
  }
  return 0
}

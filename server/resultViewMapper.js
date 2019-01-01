const { convertMsToTime, convertTimeToMs } = require('../lib/time.js')

module.exports = function resultViewMapper (classes, results) {
  const out = {}
  const riders = {}
  const stages = []
  const lastStages = {}

  classes.forEach((cls) => {
    lastStages[cls] = results.filter((r) => {
      return r.class === cls
    }).reduce((acc, current) => {
      return current.stage > acc ? current.stage : acc
    }, 0)
  })

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
    riders[rider].final_rank = results[i].final_rank
    riders[rider].name = results[i].name
    riders[rider].class = results[i].class
    riders[rider].rider_id = results[i].rider_id
    riders[rider][`stage${results[i].stage}_time`] = time(results[i].stage_time_ms, results[i].status)
    riders[rider][`stage${results[i].stage}_rank`] = results[i].stage_rank
    riders[rider][`stage${results[i].stage}_behind_leader`] = convertMsToTime(results[i].behind_leader_ms)

    if (results[i].stage === lastStages[results[i].class]) {
      // last stage, add in acc_time_behind
      riders[rider]['acc_time_behind'] = convertMsToTime(results[i].acc_time_behind)
      riders[rider]['acc_time'] = convertMsToTime(results[i].acc_time_ms)
      riders[rider]['acc_time_behind_ms'] = results[i].acc_time_behind
      riders[rider]['acc_time_ms'] = results[i].acc_time_ms
    }
  }

  for (let i = 0; i < classes.length; i++) {
    out[classes[i]] = Object.values(riders).filter((r) => {
      return r.class === classes[i]
    }).sort(compareRank)
  }

  // create graphData object
  const graphs = {}
  for (let i = 0; i < classes.length; i++) {
    graphs[`${classes[i]}-places`] = toPlacesGraphData(out[classes[i]], 5, stages)
    graphs[`${classes[i]}-times`] = toTimesGraphData(out[classes[i]], 5, stages)
  }

  return [stages.sort((a, b) => {
    return a - b
  }), out, graphs]
}

function toPlacesGraphData (rows, num, stages) {
  const ret = []
  for (let i = 0; i < num; i++) {
    if (i >= rows.length) {
      break
    }
    const o = { name: rows[i].name,
      data: stages.map((s) => {
        return [s, rows[i][`stage${s}_rank`] ]
      }).sort((a, b) => {
        return a[0] - b[0]
      }) }
    ret.push(o)
  }
  return ret
}

function toTimesGraphData (rows, num, stages) {
  const ret = []
  for (let i = 0; i < num; i++) {
    if (i >= rows.length) {
      break
    }
    const o = { name: rows[i].name,
      data: stages.map((s) => {
        return [s, convertTimeToMs(rows[i][`stage${s}_behind_leader`]) ] // in milliseconds
      }).sort((a, b) => {
        return a[0] - b[0]
      }) }
    ret.push(o)
  }
  return ret
}

function time (time, status) {
  if (time === 0) {
    return status
  }
  return convertMsToTime(time)
}

function compareRank (a, b) {
  if (a.final_rank < b.final_rank) {
    return -1
  } else if (a.final_rank > b.final_rank) {
    return 1
  }
  return 0
}

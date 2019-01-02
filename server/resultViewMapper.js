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
    graphs[`${classes[i]}-acc-times`] = toAccTimesGraphData(out[classes[i]], 5, stages)
  }

  for (let i = 0; i < classes.length; i++) {
    for (let j = 0; j < out[classes[i]].length; j++) {
      out[classes[i]][j].chartData = raceChart(out[classes[i]], j, stages)
    }
  }

  return [stages.sort((a, b) => {
    return a - b
  }), out, graphs]
}

function raceChart(rows, startIndex, stages) {
  let start = startIndex
  let stop

  const diff = (rows.length-1) - startIndex

  if(startIndex === 0) {
    stop = 4
  } else if (startIndex === 1) {
    start = 0
    stop = 4
  } else if (startIndex === rows.length - 1) {
    start = startIndex - 4
    stop = rows.length - 1
  } else if ( startIndex === rows.length - 2 ) {
    start = startIndex - 3
    stop = rows.length - 1
  } else if ( startIndex === rows.length - 3 ) {
    start = startIndex - 2
    stop = rows.length - 1
  } else {
    start = startIndex - 2
    stop = startIndex + 2
  }

  const arr = []
  for (let i = start; i <= stop; i++) {
    if(typeof rows[i] === 'undefined') {
      break
    }

    if(i === startIndex) {
      arr.push({ name: rows[i].name, data: stages.map((s) => {
        return [s, 0]
      }).sort((a, b) => {
        return a[0] - b[0]
      })})
    } else {
    //    console.log(rows[i])
      arr.push({ name: rows[i].name, data: stages.map((s) => {
        return [s, diffTime(rows[startIndex][`stage${s}_time`], rows[i][`stage${s}_time`])]
      }).sort((a, b) => {
        return a[0] - b[0]
      })})
    }

  }
  return JSON.stringify(arr)
}

function diffTime (time, otherTime) {
  return (convertTimeToMs(otherTime) - convertTimeToMs(time)) / 1000
}

function toPlacesGraphData (rows, num, stages) {
  const ret = []
  for (let i = 0; i < num; i++) {
    if (i >= rows.length) {
      break
    }
    const o = {
      name: rows[i].name,
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
    const o = {
      name: rows[i].name,
      data: stages.map((s) => {
        return [s, convertTimeToMs(rows[i][`stage${s}_behind_leader`])/1000 ] // in seconds
      }).sort((a, b) => {
        return a[0] - b[0]
      }) }
    ret.push(o)
  }
  return ret
}

function toAccTimesGraphData (rows, num, stages) {
  const ret = []

  const totals = { }
  for (let i = 0; i < num; i++) {
    if (i >= rows.length) {
      break
    }

    totals[i] = { }
    for (let j = 0; j < stages.length; j++) {
      totals[i][stages[j]] = stages.slice(0, stages[j]).reduce((acc, cur) => {
        return acc + convertTimeToMs(rows[i][`stage${cur}_time`])/1000
      }, 0)
    }
  }

  for (let i = 0; i < num; i++) {
    if (i >= rows.length) {
      break
    }

    const data = { }
    // find diffs between totals, for each stage
    const keys = Object.keys(totals)
    for (let i = 0; i < keys.length; i++) {
      if (i === 0) { // race winner
        data[i] = Object.keys(totals[i]).map((stageNum) => {
          return [parseInt(stageNum, 10), 0]
        })
      } else {
        data[i] = Object.keys(totals[i]).map((stageNum) => {
          return [parseInt(stageNum, 10), totals[i][stageNum] - totals[0][stageNum]] // diff between total for this and total for first in race
        })
      }
    }

    ret.push({
      name: rows[i].name,
      data: data[i]
    })
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


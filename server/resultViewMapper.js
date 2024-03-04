const { convertMsToTime, convertTimeToMs } = require('../lib/time')
const {
  toPlacesGraphData,
  toAccTimesGraphData,
  toTimesGraphData
} = require('./graphFactory')

module.exports = function resultViewMapper (classes, results) {
  const out = {}
  const riders = {}
  let stages = []
  const lastStages = {}

  classes.forEach((cls) => {
    lastStages[cls] = results
      .filter((r) => r.class === cls)
      .reduce((acc, current) => (current.stage > acc ? current.stage : acc), 0)
  })

  for (let i = 0; i < results.length; i++) {
    const rider = results[i].rider_id

    if (
      !stages.find((s) => {
        return s === results[i].stage
      })
    ) {
      stages.push(results[i].stage)
    }

    if (!riders[rider]) {
      riders[rider] = {}
    }

    // fill rider object with values
    riders[rider].uid = results[i].uid
    riders[rider].final_rank = results[i].final_rank
    riders[rider].name = results[i].name
    riders[rider].class = results[i].class
    riders[rider].notExplorer = !/explorer/i.test(results[i].class)
    riders[rider].rider_id = results[i].rider_id
    riders[rider].stage = results[i].stage
    riders[rider][`stage${results[i].stage}_time`] = time(
      results[i].stage_time_ms,
      results[i].status
    )
    riders[rider][`stage${results[i].stage}_rank`] = results[i].stage_rank
    riders[rider][`stage${results[i].stage}_behind_leader`] = convertMsToTime(
      results[i].behind_leader_ms
    )
    riders[rider][`stage${results[i].stage}_behind_leader_ms`] =
      results[i].behind_leader_ms
    riders[rider][`stage${results[i].stage}_percent_behind_leader`] =
      calculatePercentBehind(results[i])

    if (results[i].stage === lastStages[results[i].class]) {
      // last stage, add in acc_time_behind
      riders[rider].acc_time_behind = convertMsToTime(
        results[i].acc_time_behind
      )
      riders[rider].acc_time = convertMsToTime(results[i].acc_time_ms)
      riders[rider].acc_time_behind_ms = results[i].acc_time_behind
      riders[rider].acc_time_ms = results[i].acc_time_ms
      riders[rider].final_status = results[i].final_status
    }
  }

  stages = stages.sort((a, b) => {
    return a - b
  })

  // averages
  for (let i = 0; i < results.length; i++) {
    const rider = results[i].rider_id
    riders[rider].avg_percent_behind_leader = avg(
      riders[rider],
      stages,
      'percent_behind_leader'
    )
    riders[rider].avg_behind_leader = convertMsToTime(
      avg(riders[rider], stages, 'behind_leader_ms')
    )
  }

  for (let i = 0; i < classes.length; i++) {
    out[classes[i]] = Object.values(riders)
      .filter((r) => r.class === classes[i])
      .sort(compareRank)
  }

  const stageTotals = {}

  // create graphData object
  const graphs = {}
  for (let i = 0; i < classes.length; i++) {
    graphs[`${classes[i]}-places`] = toPlacesGraphData(
      out[classes[i]],
      5,
      stages
    )
    graphs[`${classes[i]}-times`] = toTimesGraphData(
      out[classes[i]],
      5,
      stages
    )
    graphs[`${classes[i]}-acc-times`] = toAccTimesGraphData(
      out[classes[i]],
      5,
      stages
    )

    stageTotals[classes[i]] = findStageTotals(results, stages, classes[i])
  }

  for (let i = 0; i < classes.length; i++) {
    for (let j = 0; j < out[classes[i]].length; j++) {
      out[classes[i]][j].chartData = raceChart(out[classes[i]], j, stages)
      // acc behind
      out[classes[i]][j].acc_behind_leader = toAccTimes(
        out[classes[i]],
        j,
        0,
        stages
      )
      out[classes[i]][j].acc_behind_infront = toAccTimes(
        out[classes[i]],
        j,
        j > 0 ? j - 1 : 0,
        stages
      )
      out[classes[i]][j].place_by_stage = toPlacesByStage(
        classes[i],
        out[classes[i]][j].rider_id,
        stageTotals,
        stages
      )
    }
  }

  const sortedKeys = Object.keys(out).sort()
  const sortedResults = {}

  sortedKeys.forEach((k) => {
    sortedResults[k] = out[k]
  })

  return [stages, sortedResults, graphs]
}

function findStageTotals (rows, stages, className) {
  const out = {}
  for (let i = 0; i < stages.length; i++) {
    out[stages[i]] = rows
      .filter((r) => r.stage === stages[i] && r.class === className)
      .map((r) => {
        return {
          rider: r.rider_id,
          time: r.acc_time_ms
        }
      })
      .filter((r) => r.time !== 0)
      .sort((a, b) => a.time - b.time)
  }
  return out
}

function toPlacesByStage (className, riderId, totals, stages) {
  const out = []
  for (let i = 0; i < stages.length; i++) {
    const riders = totals[className][`${stages[i]}`]
    const index = riders.findIndex((r) => {
      return r.rider === riderId
    })
    out.push(index !== -1 ? index + 1 : index)
  }
  return out
}

function calculatePercentBehind (rider) {
  if (rider.behind_leader_ms === 0) {
    // stage winner
    return '0'
  }
  const winnerTime = rider.stage_time_ms - rider.behind_leader_ms
  return ((rider.behind_leader_ms / winnerTime) * 100).toFixed(1)
}

function toAccTimes (rows, index, winner, stages) {
  const totals = {}
  totals[index] = {}
  totals[winner] = {}

  for (let j = 0; j < stages.length; j++) {
    totals[index][stages[j]] = stages.slice(0, stages[j]).reduce((acc, cur) => {
      return acc + convertTimeToMs(rows[index][`stage${cur}_time`]) / 1000
    }, 0)

    totals[winner][stages[j]] = stages
      .slice(0, stages[j])
      .reduce((acc, cur) => {
        return acc + convertTimeToMs(rows[winner][`stage${cur}_time`]) / 1000
      }, 0)
  }

  return Object.keys(totals[index]).map((stageNum) => {
    return (totals[index][stageNum] - totals[winner][stageNum]).toFixed(1) // diff between total for this and total for first in race
  })
}

function avg (o, stages, prop) {
  let sum = 0
  for (let i = 0; i < stages.length; i++) {
    sum += parseFloat(o[`stage${stages[i]}_${prop}`])
  }

  return (sum / stages.length).toFixed(1)
}

function raceChart (rows, startIndex, stages) {
  let start = startIndex
  let stop

  if (startIndex === 0) {
    stop = 4
  } else if (startIndex === 1) {
    start = 0
    stop = 4
  } else if (startIndex === rows.length - 1) {
    start = startIndex - 4
    stop = rows.length - 1
  } else if (startIndex === rows.length - 2) {
    start = startIndex - 3
    stop = rows.length - 1
  } else if (startIndex === rows.length - 3) {
    start = startIndex - 2
    stop = rows.length - 1
  } else {
    start = startIndex - 2
    stop = startIndex + 2
  }

  const arr = []
  for (let i = start; i <= stop; i++) {
    if (typeof rows[i] === 'undefined') {
      break
    }

    if (i === startIndex) {
      arr.push({
        name: rows[i].name,
        data: stages.map((s) => [s, 0]).sort((a, b) => a[0] - b[0])
      })
    } else {
      //    console.log(rows[i])
      arr.push({
        name: rows[i].name,
        data: stages
          .map((s) => [
            s,
            diffTime(
              rows[startIndex][`stage${s}_time`],
              rows[i][`stage${s}_time`]
            )
          ])
          .sort((a, b) => a[0] - b[0])
      })
    }
  }
  return JSON.stringify(arr)
}

function diffTime (time, otherTime) {
  return (convertTimeToMs(otherTime) - convertTimeToMs(time)) / 1000
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

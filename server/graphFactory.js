const { convertTimeToMs } = require('../lib/time.js')

function toPlacesGraphData (rows, num, stages) {
  const ret = []
  for (let i = 0; i < num; i++) {
    if (i >= rows.length) {
      break
    }
    const o = {
      name: rows[i].name,
      data: stages.map((s) => {
        return [s, rows[i][`stage${s}_rank`]]
      }).sort((a, b) => {
        return a[0] - b[0]
      })
    }
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
        return [s, convertTimeToMs(rows[i][`stage${s}_behind_leader`]) / 1000] // in seconds
      }).sort((a, b) => {
        return a[0] - b[0]
      })
    }
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
        return acc + convertTimeToMs(rows[i][`stage${cur}_time`]) / 1000
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

module.exports = {
  toPlacesGraphData,
  toTimesGraphData,
  toAccTimesGraphData
}

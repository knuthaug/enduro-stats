const { convertMsToTime } = require('../lib/time.js')

module.exports = function resultViewMapper (results) {
  const out = []

  let row = toRow(results[0])
  for (let i = 0; i < results.length; i++) {
    if (row.race !== results[i].race_id) {
      out.push(addFields(row, results[i - 1]))
      row = toRow(results[i])
      addDetails(row, results[i])
    } else {
      addDetails(row, results[i])
    }
  }

  out.push(addFields(row, results[results.length - 1]))

  for(let i = 0; i < out.length; i++) {
    out[i].avg_rank = avg(out[i].details, 'rank').toFixed(2)
    out[i].avg_time_behind = convertMsToTime(avg(out[i].details, 'behind_leader_ms').toFixed(0))
    out[i].avg_percent_behind = avg(out[i].details, 'percent_behind').toFixed(2)
  }
  return out
}

function avg(list, prop) {
  let sum = 0
  for(let i = 0; i < list.length; i++) {
    sum += list[i][prop]
  }

  return (sum / list.length)
}

function addDetails(row, res) {
  return row.details.push(fields(res))
}

function addFields (row, res) {
  const newRow = Object.assign(row, {
    rank: res.final_rank,
    time: time(res.acc_time_ms, res.status),
    time_behind: accTime(res.acc_time_behind, res.status)
  })
  return newRow
}

function toRow (r) {
  return {
    race: r.race_id,
    year: r.year,
    date: r.date,
    raceName: r.name,
    class: r.class,
    uid: r.uid,
    details: [ ]
  }
}

function timeBehind (time) {
  return convertMsToTime(time)
}

function fields (row) {
  return {
    name: row.stagename,
    behind_leader_ms: row.behind_leader_ms,
    time: time(row.stage_time_ms, row.status),
    rank: row.stage_rank,
    time_behind: timeBehind(row.behind_leader_ms),
    percent_behind: row.behind_leader_percent
  }
}

function time (time, status) {
  if (time === 0) {
    return status
  }
  return convertMsToTime(time)
}

function accTime (time, status) {
  if (status === 'DNF' || status === 'DNS') {
    return status
  }
  return convertMsToTime(time)
}

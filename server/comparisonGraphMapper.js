const { toPlacesGraphData, toTimesGraphData, toAccTimesGraphData } = require('./graphFactory')
const { convertMsToTime, convertTimeToMs } = require('../lib/time')

function places(raceData) {
  const { stages, riders } = commonTransformation(raceData)
  return toPlacesGraphData(Object.values(riders), Object.keys(riders).length, stages)
}

function timeBehind(data) {
  const { stages, riders } = commonTransformation(data)
  return toTimesGraphData(Object.values(riders), Object.keys(riders).length, stages)
}

function accTimeBehind(data) {
  let { stages, riders, lastStage } = commonTransformation(data)
  riders = Object.values(riders).sort((a, b) => {
    return a.acc_time_ms - b.acc_time_ms
  })
  return toAccTimesGraphData(riders, riders.length, stages)
}

function commonTransformation(data) {
  const stages = []
  const riders = {}

  const lastStage = data.reduce((acc, current) => {
    return current.stage > acc ? current.stage : acc
  }, 0)

  for (let i = 0; i < data.length; i++) {
    const rider = data[i].uid

    if (!stages.find((s) => {
      return s === data[i].stage
    })) {
      stages.push(data[i].stage)
    }

    if (!riders.hasOwnProperty(rider)) {
      riders[rider] = toBaseObject(data[i])
    }

    riders[rider].stage = data[i].stage
    riders[rider][`stage${data[i].stage}_time`] = time(data[i].stage_time_ms, data[i].status)
    riders[rider][`stage${data[i].stage}_rank`] = rank(data[i].stage_rank)
    riders[rider][`stage${data[i].stage}_behind_leader`] = convertMsToTime(data[i].behind_leader_ms)
    riders[rider][`stage${data[i].stage}_behind_leader_ms`] = data[i].behind_leader_ms
    riders[rider][`stage${data[i].stage}_percent_behind_leader`] = calculatePercentBehind(data[i])

    if (data[i].stage === lastStage) {
      // last stage, add in acc_times and final status
      riders[rider]['acc_time_behind'] = convertMsToTime(data[i].acc_time_behind)
      riders[rider]['acc_time'] = convertMsToTime(data[i].acc_time_ms)
      riders[rider]['acc_time_behind_ms'] = data[i].acc_time_behind
      riders[rider]['acc_time_ms'] = data[i].acc_time_ms
      riders[rider]['final_status'] = data[i].final_status
    }
  }
  return { stages, riders, lastStage }
}

function rank(rank) {
  if(rank === 999) {
    return 0
  }

  return rank
}

function toBaseObject(o) {
  return {
    uid: o.uid,
    final_rank: o.final_rank,
    name: o.name,
    class: o.class,
    rider_id: o.rider_id
  }
}

function calculatePercentBehind (rider) {
  if (rider.behind_leader_ms === 0) { // stage winner
    return '0'
  }
  const winnerTime = rider.stage_time_ms - rider.behind_leader_ms
  return ((rider.behind_leader_ms / winnerTime) * 100).toFixed(1)
}

function time (time, status) {
  if (time === 0) {
    return status
  }
  return convertMsToTime(time)
}

module.exports = {
  places,
  timeBehind,
  accTimeBehind
}

const { toPlacesGraphData } = require('./graphFactory')
const { convertMsToTime, convertTimeToMs } = require('../lib/time')

function places(raceData) {
  const stages = []
  const riders = {}
  const lastStage = raceData.reduce((acc, current) => {
    return current.stage > acc ? current.stage : acc
  }, 0)

  for (let i = 0; i < raceData.length; i++) {
    const rider = raceData[i].uid

    if (!stages.find((s) => {
      return s === raceData[i].stage
    })) {
      stages.push(raceData[i].stage)
    }

    if (!riders.hasOwnProperty(rider)) {
      riders[rider] = toBaseObject(raceData[i])
    }

    riders[rider].stage = raceData[i].stage
    riders[rider][`stage${raceData[i].stage}_time`] = time(raceData[i].stage_time_ms, raceData[i].status)
    riders[rider][`stage${raceData[i].stage}_rank`] = rank(raceData[i].stage_rank)
    riders[rider][`stage${raceData[i].stage}_behind_leader`] = convertMsToTime(raceData[i].behind_leader_ms)
    riders[rider][`stage${raceData[i].stage}_behind_leader_ms`] = raceData[i].behind_leader_ms
    riders[rider][`stage${raceData[i].stage}_percent_behind_leader`] = calculatePercentBehind(raceData[i])

    if (raceData[i].stage === lastStage) {
      // last stage, add in acc_times and final status
      riders[rider]['acc_time_behind'] = convertMsToTime(raceData[i].acc_time_behind)
      riders[rider]['acc_time'] = convertMsToTime(raceData[i].acc_time_ms)
      riders[rider]['acc_time_behind_ms'] = raceData[i].acc_time_behind
      riders[rider]['acc_time_ms'] = raceData[i].acc_time_ms
      riders[rider]['final_status'] = raceData[i].final_status
    }
  }

  return toPlacesGraphData(Object.values(riders), Object.keys(riders).length, stages)
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
  places
}

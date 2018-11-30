class StageCalculations {

  differentials(rows, race, stage_id) {
    const stageResults = []
    let stages = []

    for(let i = 0; i < rows.length; i++) {
      const stageResult = {
        id: rows[i].id,
        rank: rows[i].rank,
        status: rows[i].status,
        time: rows[i].time,
        timems: rows[i].timems,
        rider_id: rows[i].rider_id,
        stage: rows[i].stage,
        class: rows[i].class,
        race_id: race,
        stage_id: rows[i].stage_id,
        acc_time: 0
      }

      const found = stages.findIndex((el) => {
        return el === rows[i].stage
      })

      if(found === -1) {
        stages.push(rows[i].stage)
      }

      if(rows[i].status === 'DNS' || rows[i].status === 'DNF') {
        stageResults.push(this.allZeroed(stageResult.rider_id, stageResult.stage, race, rows[i].status))
        continue
      }

      if(rows[i].rank === 1) {
        stageResult.behind_leader_ms = 0
      }

      stageResult.behind_leader_ms = this.timeBehindRider(rows[i], this.firstInStage(rows, stageResult.stage))

      if(rows[i].stage === 1) {
        stageResult.acc_time = rows[i].timems
      } else {
        const prevAccTime = this.stageForRider(stageResults, (rows[i].stage - 1), rows[i].rider_id).acc_time
        stageResult.acc_time = prevAccTime + rows[i].timems
      }

      stageResults.push(stageResult)
    }
    return this.calculateTotals(stageResults, stages)
  }

  calculateTotals(rows, stages) {
    for(let i = 0; i < stages.length; i++) {
      const res = this.calculateTotalsForStage(rows, stages[i])
    }
    return rows
  }

  calculateTotalsForStage(rows, stage) {
    let max = 0
    let maxIndex = 0

    const last = rows.filter((r) => {
      return r.stage === stage
    }).sort((a, b) => {
      return a.rank - b.rank
    })

    //console.log(last)
    //console.log('---------------------------------------------------------------------------------')

    let rank = 1
    for(let i = 0; i < last.length; i++) {
      if(i === 0) { //first in stage results equal rank 1
        //console.log(`setting acc_time_behind=0 for ${last[0].rider_id}`)
        last[0].acc_time_behind = 0
      } else {
        last[i].acc_time_behind = last[i].acc_time - last[i - 1].acc_time
      }
      last[i].total_rank = rank++
    }
  }

  allZeroed(rider_id, stage, race_id, status) {
    return {
      rider_id,
      stage,
      status,
      rank: 999,
      race_id,
      acc_time_behind: 0,
      total_rank: 0,
      acc_time: 0,
      behind_leader_ms: 0
    }
  }

  accumulatedTimeBehindRider(rows, rider, leader) {
    const stage = rider.stage

    if(stage === 1) {
      return this.timeBehindRider(rider, leader)
    }

    const riderResults = this.allResultsForRider(rows, rider.rider_id)
    const leaderResults = this.allResultsForRider(rows, leader.rider_id)

    return 0

  }

  allResultsForRider(rows, riderId) {
    return rows.filter((element) => {
      return element.rider_id == riderId
    })
  }

  firstInStage(rows, stageNumber) {
    return rows.find((element) => {
      return element.stage === stageNumber && element.rank === 1
    })
  }

  stageForRider(rows, stageNumber, riderId) {
    return rows.find((element) => {
      return element.stage === stageNumber && element.rider_id === riderId
    })
  }

  timeBehindRider(currentRider, previousRider) {
    return currentRider.timems - previousRider.timems
  }

}

module.exports = StageCalculations

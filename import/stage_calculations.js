class StageCalculations {

  differentials(rows, race) {
    const stageResults = []

    for(let i = 0; i < rows.length; i++) {
      const stageResult = {rider_id: rows[i].rider_id, stage: rows[i].stage, race_id: race, acc_time: 0}

      if(rows[i].status === 'DNS' || rows[i].status === 'DNF') {
        stageResults.push(this.allZeroed())
        continue
      }

      if(rows[i].rank === 1) {
        stageResult.behindleaderms = 0
      }

      stageResult.behindleaderms = this.timeBehindRider(rows[i], this.firstInStage(rows, stageResult.stage))

      if(rows[i].stage === 1) {
        stageResult.acc_time = rows[i].timems
      } else {
        const prevAccTime = this.stageForRider(stageResults, (rows[i].stage - 1), rows[i].rider_id).acc_time
        stageResult.acc_time = prevAccTime + rows[i].timems
      }

      stageResults.push(stageResult)
    }

    return this.calculateTotals(stageResults)
  }

  calculateTotals(rows) {
    const newRows = []
    let max = 0
    let maxIndex = 0

    const stage6 = rows.filter((r) => {
      return r.stage === 6
    }).sort((a, b) => {
      return a.acc_time - b.acc_time
    })

    let rank = 1
    for(let i = 0; i < stage6.length; i++) {
      if(i === 0) {
        stage6[0].acc_time_behind = 0
      } else {
        stage6[i].acc_time_behind = stage6[i].acc_time - stage6[i - 1].acc_time
      }
      stage6[i].total_rank = rank++
    }

    return rows
  }

  allZeroed() {
    return {
      acc_time: 0,
      behindleaderms: 0
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

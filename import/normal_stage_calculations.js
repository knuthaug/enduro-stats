const { indexOf, maxValue, rowsForRider, findAllRiders,
        find, stagesForRider, stageIndexesForStage } = require('./listUtil.js')

class NormalStageCalculations {
  constructor() {
  }

  differentials(rows) {

    const riders = findAllRiders(rows)
    this.accStageTimes(rows, riders)

    return rows
  }

  accStageTimes(rows, riders) {
    for (let i = 0; i < riders.length; i++) {
      this.stageTimes(rows, riders[i])
    }
  }

  stageTimes (rows, riderId) {
    // find all stage for rider, indexes
    const stageIndexes = stagesForRider(rows, riderId)

    for (let i = 0; i < stageIndexes.length; i++) {
      if (i === 0) { // first stage
        rows[stageIndexes[i]].acc_time_ms = rows[stageIndexes[i]].stage_time_ms
      } else {
        rows[stageIndexes[i]].acc_time_ms = rows[stageIndexes[i]].stage_time_ms + rows[stageIndexes[i - 1]].acc_time_ms
      }
    }
  }
}


module.exports = NormalStageCalculations

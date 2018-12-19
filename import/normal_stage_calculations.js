const { indexOf, maxValue, rowsForRider, findAllRiders,
  find, stagesForRider, stageIndexesForStage } = require('./listUtil.js')

const StageCalculations = require('./stage_calculations.js')

class NormalStageCalculations extends StageCalculations {
  differentials (rows) {
    const riders = findAllRiders(rows)
    const {stages, stageIds} = this.stagesAndStageIds(rows)

    this.accStageTimes(rows, riders)
    this.fillMissingStages(rows, riders, stages, stageIds)
    this.findFinalRanks(rows, riders, stages)
    return rows
  }

  accStageTimes (rows, riders) {
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

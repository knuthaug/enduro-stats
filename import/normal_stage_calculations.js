const { ERROR_STATUS, OK_STATUS } = require('./constants.js')
const { findAllRiders, stagesForRider, stageIndexesForStage } = require('./listUtil.js')

const StageCalculations = require('./stage_calculations.js')

class NormalStageCalculations extends StageCalculations {
  differentials (rows) {
    const riders = findAllRiders(rows)
    const { stages, stageIds } = this.stagesAndStageIds(rows)

    this.accStageTimes(rows, riders)
    this.findFinalRanks(rows, riders, stages)
    this.findRelativeStageTimes(rows, stages)
    this.fillMissingStages(rows, riders, stages, stageIds)
    this.findFinalRanks(rows, riders, stages)
    return rows
  }

  findRelativeStageTimes (rows, stages) {
    for (let i = 0; i < stages.length; i++) {
      this.relativeStageTimes(rows, stages[i], stages[stages.length - 1])
    }
  }

  relativeStageTimes (rows, stageNum, maxStage) {
    // find all results for stageId
    const originalStageIndex = stageIndexesForStage(rows, stageNum)

    const stageResults = this.sortedStageTimes(rows,
      originalStageIndex[0],
      originalStageIndex[originalStageIndex.length - 1] + 1)

    for (let i = 0; i < stageResults.length; i++) {
      if (stageResults[i].stage_rank === 1) {
        stageResults[i].behind_leader_ms = 0
      } else {
        if (this.notFinished(stageResults[i])) {
          stageResults[i].behind_leader_ms = 0
          continue
        }

        stageResults[i].behind_leader_ms = this.timeBehindRider(stageResults[i], this.firstInStage(stageResults, stageResults[i].stage))
      }

      // acc_time_behind, just for last stage
      if (stageResults[i].stage === maxStage) {
        if (stageResults[i].rank === 1) {
          stageResults[i].acc_time_behind = 0
        } else {
          if (this.notFinished(stageResults[i])) {
            stageResults[i].acc_time_behind = 0
            continue
          }
          stageResults[i].acc_time_behind = this.accTimeBehindRider(stageResults[i], this.firstInRace(stageResults, maxStage))
        }
      }
    }
    rows.splice(originalStageIndex[0], originalStageIndex.length, ...stageResults)
  }

  accStageTimes (rows, riders) {
    for (let i = 0; i < riders.length; i++) {
      this.stageTimes(rows, riders[i])
    }
  }

  // overridden here because rank is not set for complete race imports
  firstInRace (rows, stageNumber) {
    return rows.find((element) => {
      return element.stage === stageNumber && element.final_rank === 1
    })
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

      // fix erroneous times with ok status
      if (rows[stageIndexes[i]].stage_time_ms === 0 && rows[stageIndexes[i]].status === OK_STATUS) {
        rows[stageIndexes[i]].status = ERROR_STATUS
        rows[stageIndexes[i]].acc_time_ms = 0
      } else if(rows[stageIndexes[i]].stage_time_ms === 0) {
        rows[stageIndexes[i]].acc_time_ms = 0
      }
    }
  }
}

module.exports = NormalStageCalculations

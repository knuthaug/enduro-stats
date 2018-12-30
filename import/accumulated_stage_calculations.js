const { ERROR_STATUS } = require('./constants.js')

const { findAllRiders, stagesForRider, stageIndexesForStage } = require('./listUtil.js')

const StageCalculations = require('./stage_calculations.js')

class AccumulatedStageCalculations extends StageCalculations {
  differentials (rows, options) {
    const riders = findAllRiders(rows)
    const { stages, stageIds } = this.stagesAndStageIds(rows)

    this.findStageTimes(rows, riders)
    this.findStageRanks(rows, stages)
    this.fillMissingStages(rows, riders, stages, stageIds)
    this.sanityCheck(rows, riders)
    this.findFinalRanks(rows, riders, stages)
    return rows
  }

  findStageTimes (rows, riders) {
    for (let i = 0; i < riders.length; i++) {
      this.stageTimes(rows, riders[i])
    }
  }

  sanityCheck (rows, riders) {
    for (let i = 0; i < riders.length; i++) {
      this.checkRiderResults(rows, riders[i])
    }
  }

  checkRiderResults (rows, riderId) {
    const stageIndexes = stagesForRider(rows, riderId)

    let err = false
    for (let i = 0; i < stageIndexes.length; i++) {
      if (this.notFinished(rows[stageIndexes[i]]) || rows[stageIndexes[i]].stage_time_ms === 0) {
        err = true
      }
    }

    for (let i = 0; i < stageIndexes.length; i++) {
      if (err) {
        rows[stageIndexes[i]].acc_time_ms = 0
        //rows[stageIndexes[i]].behind_leader_ms = 0
        rows[stageIndexes[i]].acc_time_behind = 0
      }
    }
  }

  findStageRanks (rows, stages) {
    for (let i = 0; i < stages.length; i++) {
      this.stageRanks(rows, stages[i], stages[stages.length - 1])
    }
  }

  stageTimes (rows, riderId) {
    // find all stage for rider, indexes
    const stageIndexes = stagesForRider(rows, riderId)

    for (let i = 0; i < stageIndexes.length; i++) {
      if (i === 0) {
        if (rows[stageIndexes[i]].acc_time_ms < 0) {
          rows[stageIndexes[i]].stage_time_ms = 0
          rows[stageIndexes[i]].status = ERROR_STATUS
          rows[stageIndexes[i]].acc_time_ms = 0
        } else {
          rows[stageIndexes[i]].stage_time_ms = rows[stageIndexes[i]].acc_time_ms
        }
      } else {
        if (this.notFinished(rows[stageIndexes[i]])) {
          rows[stageIndexes[i]].stage_time_ms = 0
          continue
        }
        const diff = rows[stageIndexes[i]].acc_time_ms - rows[stageIndexes[i - 1]].acc_time_ms

        if (diff < 0) {
          rows[stageIndexes[i]].stage_time_ms = 0
          rows[stageIndexes[i]].status = ERROR_STATUS
          rows[stageIndexes[i]].acc_time_ms = 0
        } else {
          rows[stageIndexes[i]].stage_time_ms = diff
        }
      }
    }
  }

  stageRanks (rows, stageNum, maxStage) {
    // find all results for stageId
    const originalStageIndex = stageIndexesForStage(rows, stageNum)

    const stageResults = this.sortedStageTimes(rows,
      originalStageIndex[0],
      originalStageIndex[originalStageIndex.length - 1] + 1)
    let rank = 1

    for (let i = 0; i < stageResults.length; i++) {
      stageResults[i].stage_rank = rank++
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
}

module.exports = AccumulatedStageCalculations

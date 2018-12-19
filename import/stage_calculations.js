const ERROR_STATUS = 'ERROR'
const DNS_STATUS = 'DNS'
const DNF_STATUS = 'DNF'
const ERROR_RANK = 999

const { indexOf, maxValue, rowsForRider, findAllRiders,
        find, stagesForRider, stageIndexesForStage } = require('./listUtil.js')

class StageCalculations {

  stagesAndStageIds(rows) {
    const stages = []
    const stageIds = {}

    for (let i = 0; i < rows.length; i++) {
      if (indexOf(stages, rows[i].stage) === -1) {
        stages.push(rows[i].stage)
        stageIds[rows[i].stage] = rows[i].stage_id
      }
    }
    return {stages, stageIds}
  }

  findFinalRanks (rows, riders, stages) {
    const indexes = {}
    for (let i = 0; i < rows.length; i++) {
      if (this.isLastStage(rows[i], stages)) {
        indexes[rows[i].id] = i
      }
    }

    const lastStages = this.lastStages(rows, stages)

    let rank = 1
    for (let i = 0; i < lastStages.length; i++) {
      const rowIndex = indexes[lastStages[i].id]
      rows[rowIndex].final_rank = rank++
    }
  }

  lastStages (rows, stages) {
    return rows.filter((r) => {
      return r.stage === stages[stages.length - 1]
    }).sort(this.sortByAccTime)
  }

  sortByAccTime (a, b) {
    if (a.acc_time_ms === 0) {
      return 1
    }

    if (b.acc_time_ms === 0) {
      return -1
    }

    if (a.acc_time_ms > b.acc_time_ms) {
      return 1
    } else if (b.acc_time_ms > a.acc_time_ms) {
      return -1
    }
    return 0
  }
  
  isLastStage (row, stages) {
    return row.stage === stages[stages.length - 1]
  }

  fillMissingStages (rows, riders, stages, stageIds) {
    // make sure all riders have results for each stageRanks
    for (let i = 0; i < riders.length; i++) {
      const ro = rowsForRider(rows, riders[i])

      if (ro.length < stages.length) { // missing stages
        for (let j = 0; j < stages.length; j++) {
          if (!find(ro, 'stage', stages[j])) {
            rows.push(this.defaultResult(stages[j],
                                         stageIds[j],
                                         ro[0].race_id,
                                         ro[0].rider_id,
                                         ro[0].class,
                                         maxValue(rows, 'id')))
          }
        }
      }
    }
  }

  defaultResult (stage, stageId, raceId, riderId, clazz, id) {
    return {
      id: id + 1,
      rank: ERROR_RANK,
      stage,
      time: '00:00.0',
      class: clazz,
      acc_time_ms: 0,
      rider_id: riderId,
      stage_id: stageId,
      race_id: raceId,
      stage_rank: ERROR_RANK,
      stage_time_ms: 0,
      status: DNS_STATUS
    }
  }
}

module.exports = StageCalculations

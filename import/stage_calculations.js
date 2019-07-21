const { ERROR_STATUS, ERROR_RANK, DNS_STATUS, DSQ_STATUS, DNF_STATUS, OK_STATUS } = require('./constants.js')

const { indexOf, maxValue, stagesForRider, rowsForRider, find } = require('./listUtil.js')

class StageCalculations {
  stagesAndStageIds (rows) {
    const stages = []
    const stageIds = {}

    for (let i = 0; i < rows.length; i++) {
      if (indexOf(stages, rows[i].stage) === -1) {
        stages.push(rows[i].stage)
        stageIds[rows[i].stage] = rows[i].stage_id
      }
    }
    return { stages, stageIds }
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
      if (i > 0) { // handle riders with same time
        const prevRowIndex = indexes[lastStages[i - 1].id]
        if (rows[rowIndex].acc_time_ms === rows[prevRowIndex].acc_time_ms &&
            rows[rowIndex].acc_time_ms !== 0) { // same time, same rank
          rows[rowIndex].final_rank = rows[prevRowIndex].final_rank
          rank++
        } else {
          rows[rowIndex].final_rank = rank++
        }
      } else { // first rider
        rows[rowIndex].final_rank = rank++
      }
    }
  }

  sanityCheck (rows, riders) {
    for (let i = 0; i < riders.length; i++) {
      this.checkRiderResults(rows, riders[i])
    }
  }

  checkRiderResults (rows, riderId) {
    const stageIndexes = stagesForRider(rows, riderId)

    let skipped = 0
    let err = false
    let abortedRace = false
    let notStartedRace = false
    let disqualified = false

    for (let i = 0; i < stageIndexes.length; i++) {
      if (!abortedRace && this.abortedRace(rows, stageIndexes, i)) {
        abortedRace = true
        rows[stageIndexes[i]].status = DNF_STATUS
        skipped++
      } else if (this.notRiddenStage(rows, stageIndexes, i)) {
        rows[stageIndexes[i]].status = DNS_STATUS
        skipped++
      } else if (this.disqualified(rows, stageIndexes, i)) {
        rows[stageIndexes[i]].status = DSQ_STATUS
        skipped++
      }

      if (this.notFinished(rows[stageIndexes[i]]) || rows[stageIndexes[i]].stage_time_ms === 0) {
        err = true
      }

      if (i === stageIndexes.length - 1) { // last stage, check if all stages are DNS
        notStartedRace = this.notStartedRace(rows, stageIndexes)
        abortedRace = this.fullAbortedRace(rows, stageIndexes)
        disqualified = this.disqualified(rows[stageIndexes[i]])

        if (notStartedRace) {
          skipped = stageIndexes.length
        }
      }
    }

    for (let i = 0; i < stageIndexes.length; i++) {
      if (err) {
        rows[stageIndexes[i]].acc_time_ms = 0
        rows[stageIndexes[i]].acc_time_behind = 0
      }

      if (i === stageIndexes.length - 1) {
        if (abortedRace && !notStartedRace) {
          rows[stageIndexes[i]].final_status = DNF_STATUS
          rows[stageIndexes[i]].skipped_stages = skipped
        } else if (notStartedRace) {
          rows[stageIndexes[i]].final_status = DNS_STATUS
          rows[stageIndexes[i]].skipped_stages = skipped
        } else if (disqualified) {
          rows[stageIndexes[i]].final_status = DSQ_STATUS
          rows[stageIndexes[i]].skipped_stages = stageIndexes.length
        } else if (!abortedRace && !notStartedRace) {
          rows[stageIndexes[i]].final_status = OK_STATUS
          rows[stageIndexes[i]].skipped_stages = 0
        }
      }
    }
  }

  // are all stages DNS?
  notStartedRace (rows, indexes) {
    const statuses = []
    for (let i = 0; i < indexes.length; i++) {
      statuses.push(rows[indexes[i]].status === DNS_STATUS)
    }
    return statuses.every(s => s)
  }

  // are some stages either DNS, DNF or DSQ?
  fullAbortedRace (rows, indexes) {
    const statuses = []
    for (let i = 0; i < indexes.length; i++) {
      statuses.push(rows[indexes[i]].status === DNS_STATUS ||
                    rows[indexes[i]].status === DNF_STATUS ||
                    rows[indexes[i]].status === ERROR_STATUS)
    }
    return statuses.some(s => s)
  }

  notRiddenStage (rows, indexes, index) {
    const obj = rows[indexes[index]]
    return obj.status === DNS_STATUS || obj.status === DNF_STATUS
  }

  disqualified (obj) {
    return obj.status === DSQ_STATUS
  }

  abortedRace (rows, indexes, index) {
    if (index === 0) {
      return false
    }

    const obj = rows[indexes[index]]
    return (obj.status === DNS_STATUS || obj.status === DNF_STATUS) && rows[indexes[index - 1]].status === OK_STATUS
  }

  lastStages (rows, stages) {
    return rows.filter((r) => {
      return r.stage === stages[stages.length - 1]
    }).sort(this.sortByAccTime)
  }

  sortByAccTime (a, b) {
    if (a.skipped_stages > b.skipped_stages) {
      return 1
    } else if (b.skipped_stages > a.skipped_stages) {
      return -1
    }

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

  sortedStageTimes (rows, start, end) {
    return rows.slice(start, end).sort((a, b) => {
      if (a.stage_time_ms === 0) {
        return 1
      }
      if (b.stage_time_ms === 0) {
        return -1
      }
      return a.stage_time_ms - b.stage_time_ms
    })
  }

  firstInRace (rows, stageNumber) {
    return rows.find((element) => {
      return element.stage === stageNumber && element.rank === 1
    })
  }

  firstInRaceByTime (rows, stageNumber) {
    const sorted = rows.sort((a, b) => {
      if (a.acc_time_ms > b.acc_time_ms) {
        return 1
      } else if (a.acc_time_ms < b.acc_time_ms) {
        return -1
      }
      return 0
    })
    return sorted[0]
  }

  notFinished (obj) {
    return obj.status === DNS_STATUS || obj.status === DNF_STATUS || obj.status === ERROR_STATUS || obj.status === DSQ_STATUS
  }

  timeBehindRider (currentRider, otherRider) {
    return currentRider.stage_time_ms - otherRider.stage_time_ms
  }

  percentBehindRider (currentRider, otherRider) {
    const diff = currentRider.stage_time_ms - otherRider.stage_time_ms
    return ((diff / currentRider.stage_time_ms) * 100).toFixed(1)
  }

  accTimeBehindRider (currentRider, otherRider) {
    return currentRider.acc_time_ms - otherRider.acc_time_ms
  }

  firstInStage (rows, stageNumber) {
    return rows.find((element) => {
      return element.stage === stageNumber && element.stage_rank === 1
    })
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
              maxValue(rows, 'id'),
              find(ro, 'stage', stages[j - 1])))
          }
        }
      }
    }
  }

  defaultResult (stage, stageId, raceId, riderId, clazz, id, previous) {
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
      status: previous ? DNF_STATUS : DNS_STATUS
    }
  }
}

module.exports = StageCalculations

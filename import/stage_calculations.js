const ERROR_STATUS = 'ERROR'
const DNS_STATUS = 'DNS'
const DNF_STATUS = 'DNF'
const ERROR_RANK = 999

class StageCalculations {
  differentials (rows, options) {
    if(!options) {
      options = { accumulate: true }
    }
    const stages = []
    const stageIds = {}

    const riders = this.findAllRiders(rows)

    this.findStageTimes(rows, riders, options.accumulate)
    this.findTimeBehindLeader(rows, stages, stageIds)
    this.findStageRanks(rows, stages, options.accumulate)
    this.fillMissingStages(rows, riders, stages, stageIds)
    this.findFinalRanks(rows, riders, stages)
    return rows
  }

  findAllRiders (rows) {
    return rows.map((el) => {
      return el.rider_id
    }).filter((value, index, self) => {
      return self.indexOf(value) === index
    })
  }

  findTimeBehindLeader (rows, stages, stageIds) {
    for (let i = 0; i < rows.length; i++) {
      const found = stages.findIndex((el) => {
        return el === rows[i].stage
      })

      if (found === -1) {
        stages.push(rows[i].stage)
        stageIds[rows[i].stage] = rows[i].stage_id
      }

      if (this.notFinished(rows[i])) {
        rows[i].behind_leader_ms = 0
        continue
      }
    }
  }

  findStageTimes (rows, riders, accumulative) {
    for (let i = 0; i < riders.length; i++) {
      if(accumulative) {
        this.stageTimesAccumulative(rows, riders[i])
      } else {
        this.stageTimes(rows, riders[i])
      }

    }
  }

  findStageRanks (rows, stages, accumulative) {
    for (let i = 0; i < stages.length; i++) {
      this.stageRanks(rows, stages[i], stages[stages.length - 1], accumulative)
    }
  }

  findFinalRanks (rows, riders, stages) {
    const indexes = {}
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].stage === stages[stages.length - 1]) {
        indexes[rows[i].id] = i
      }
    }

    const lastStages = rows.filter((r) => {
      return r.stage === stages[stages.length - 1]
    }).sort(this.sortByAccTime)

    let rank = 1
    for (let i = 0; i < lastStages.length; i++) {
      const rowIndex = indexes[lastStages[i].id]
      rows[rowIndex].final_rank = rank++
    }
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

  fillMissingStages (rows, riders, stages, stageIds) {
    // make sure all riders have results for each stageRanks
    for (let i = 0; i < riders.length; i++) {
      const ro = rows.filter((r) => {
        return r.rider_id === riders[i]
      })

      if (ro.length < stages.length) {
        for (let j = 0; j < stages.length; j++) {
          const found = ro.find((r) => {
            return r.stage === stages[j]
          })

          if (!found) {
            rows.push(this.defaultResult(stages[j], stageIds[j], ro[0].race_id, ro[0].rider_id, ro[0].class, this.maxId(rows)))
          }
        }
      }
    }
  }

  maxId (r) {
    return r.reduce((acc, current) => {
      return current.id > acc ? current.id : acc
    }, 0)
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

  stageTimesAccumulative (rows, riderId) {
    // find all stage for rider, indexes
    const stageIndexes = rows.map((r, index) => {
      if (r.rider_id === riderId) {
        return index
      }
    }).filter((e) => {
      return typeof e !== 'undefined'
    })

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

  //calculate acc_time_ms since stage_time_ms is set earlier
   stageTimes (rows, riderId) {
    // find all stage for rider, indexes
    const stageIndexes = rows.map((r, index) => {
      if (r.rider_id === riderId) {
        return index
      }
    }).filter((e) => {
      return typeof e !== 'undefined'
    })

    for (let i = 0; i < stageIndexes.length; i++) {
      if(i === 0) { //first stage
        rows[stageIndexes[i]].acc_time_ms = rows[stageIndexes[i]].stage_time_ms
      } else {
        rows[stageIndexes[i]].acc_time_ms = rows[stageIndexes[i]].stage_time_ms + rows[stageIndexes[i - 1]].acc_time_ms
      }
    }
  }



  stageRanks (rows, stageNum, maxStage, accumulative) {
    // find all results for stageId
    const originalStageIndex = rows.map((r, index) => {
      if (r.stage === stageNum) {
        return index
      }
      return undefined
    }).filter((e) => {
      return typeof e !== 'undefined'
    })
    // console.log(originalStageIndex)

    const stageResults = rows.slice(originalStageIndex[0], originalStageIndex[originalStageIndex.length - 1] + 1).sort((a, b) => {
      if (a.stage_time_ms === 0) {
        return 1
      }
      if (b.stage_time_ms === 0) {
        return -1
      }
      return a.stage_time_ms - b.stage_time_ms
    })
    // console.log(stageResults)

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

        if(accumulative) {
          stageResults[i].behind_leader_ms = this.timeBehindRider(stageResults[i], this.firstInStage(stageResults, stageResults[i].stage))
        } else {
          stageResults[i].behind_leader_ms = -1
        }
      }

      // acc_time_behind, just for last stage
      if(accumulative) {
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
      } else {
        if (stageResults[i].stage === maxStage) {
          if (stageResults[i].stage_rank === 1) {
            stageResults[i].acc_time_behind = 0
          } else {
            if (this.notFinished(stageResults[i])) {
              stageResults[i].acc_time_behind = 0
              continue
            }
            stageResults[i].acc_time_behind = this.accTimeBehindRider(stageResults[i], this.firstInRaceByTime(stageResults, maxStage))
          }
        }
      }
    }
    rows.splice(originalStageIndex[0], originalStageIndex.length, ...stageResults)
  }

  notFinished (obj) {
    return obj.status === DNS_STATUS || obj.status === DNF_STATUS || obj.status === ERROR_STATUS
  }

  firstInStage (rows, stageNumber) {
    return rows.find((element) => {
      return element.stage === stageNumber && element.stage_rank === 1
    })
  }

  firstInRace (rows, stageNumber) {
    return rows.find((element) => {
      return element.stage === stageNumber && element.rank === 1
    })
  }

  firstInRaceByTime (rows, stageNumber) {
    const sorted = rows.sort((a, b) => {
      if(a.acc_time_ms > b.acc_time_ms) {
        return 1
      } else if (a.acc_time_ms < b.acc_time_ms) {
        return -1
      }
      return 0
    })
    return sorted[0]
  }

  timeBehindRider (currentRider, otherRider) {
    return currentRider.stage_time_ms - otherRider.stage_time_ms
  }

  accTimeBehindRider (currentRider, otherRider) {
    return currentRider.acc_time_ms - otherRider.acc_time_ms
  }
}

module.exports = StageCalculations

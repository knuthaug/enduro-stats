class StageCalculations {
  differentials (rows, race, stageId) {
    let stages = []

    // calculate stage times for all riders
    const riders = rows.map((el) => {
      return el.rider_id
    }).filter((value, index, self) => {
      return self.indexOf(value) === index
    })

    for (let i = 0; i < riders.length; i++) {
      this.stageTimes(rows, riders[i])
    }

    for (let i = 0; i < rows.length; i++) {
      const found = stages.findIndex((el) => {
        return el === rows[i].stage
      })

      if (found === -1) {
        stages.push(rows[i].stage)
      }

      if (rows[i].status === 'DNS' || rows[i].status === 'DNF') {
        rows[i].behind_leader_ms = 0
        continue
      }
    }

    for (let i = 0; i < stages.length; i++) {
      this.stageRanks(rows, stages[i], stages[stages.length - 1])
    }

    return rows
  }

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
      if (i === 0) {
        rows[stageIndexes[i]].stage_time_ms = rows[stageIndexes[i]].acc_time_ms
      } else {
        if (this.notFinished(rows[stageIndexes[i]])) {
          rows[stageIndexes[i]].stage_time_ms = 0
          continue
        }

        rows[stageIndexes[i]].stage_time_ms = rows[stageIndexes[i]].acc_time_ms - rows[stageIndexes[i - 1]].acc_time_ms

      }
    }
  }

  stageRanks (rows, stageNum, maxStage) {
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

        stageResults[i].behind_leader_ms = this.timeBehindRider(stageResults[i], this.firstInStage(stageResults, stageResults[i].stage))

      }

      //acc_time_behind, just for last stage
      if(stageResults[i].stage === maxStage) {
        if(stageResults[i].rank === 1) {
          stageResults[i].acc_time_behind = 0
        } else {
          if(this.notFinished(stageResults[i])) {
            stageResults[i].acc_time_behind = 0
            continue
          }
          stageResults[i].acc_time_behind = this.accTimeBehindRider(stageResults[i], this.firstInRace(stageResults, stageResults[i].stage))
        }
      }
    }
    rows.splice(originalStageIndex[0], originalStageIndex.length, ...stageResults)
  }

  notFinished (obj) {
    return obj.status === 'DNS' || obj.status === 'DNF'
  }

  firstInStage (rows, stageNumber) {
    const first = rows.find((element) => {
      return element.stage === stageNumber && element.stage_rank === 1
    })
    //console.log(`first in stage ${first.rider_id} for stage=${stageNumber}`)
    return first
  }

  firstInRace (rows, stageNumber) {
    return rows.find((element) => {
      return element.stage === stageNumber && element.rank === 1
    })
  }

  timeBehindRider (currentRider, otherRider) {
    return currentRider.stage_time_ms - otherRider.stage_time_ms
  }

  accTimeBehindRider (currentRider, otherRider) {
    return currentRider.acc_time_ms - otherRider.acc_time_ms
  }
}

module.exports = StageCalculations

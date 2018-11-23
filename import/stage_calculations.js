class StageCalculations {

  differentials(rows, stage) {
    const newRows = []

    const colName = `stage${stage}_behindms`
    const colNameLeader = `stage${stage}_behindleaderms`
    const colPercent = `stage${stage}_behindpercent`
    const colPercentLeader = `stage${stage}_behindleaderpercent`

    for(let i = 0; i < rows.length; i++) {
      if(i === 0) {
        rows[i][colName] = 0
        rows[i][colNameLeader] = 0
        rows[i][colPercent] = 0
        rows[i][colPercentLeader] = 0
        newRows.push(rows[i])
        continue
      }

      this.addCol(rows[i], colName, this.timeBehindBetweenRider(rows[i], rows[i - 1])) // behind prevous rider
      this.addCol(rows[i], colNameLeader, this.timeBehindBetweenRider(rows[i], rows[0])) // behind leader
      this.addCol(rows[i],  colPercent, this.percentBehindRider(rows[i], rows[i - 1])) // behind previous rider
      this.addCol(rows[i],  colPercentLeader, this.percentBehindRider(rows[i], rows[0])) // behind leader
      newRows.push(rows[i])
    }
    return newRows
  }

  addCol(rider, colName, value) {
    rider[colName] = value
  }

  timeBehindBetweenRider(currentRider, previousRider) {
    return currentRider.timems - previousRider.timems
  }

  percentBehindRider(currentRider, previousRider) {
    const diff = currentRider.timems - previousRider.timems
    return (diff / previousRider.timems) * 100
  }

  percentBehind(rows, stage) {
    const newRows = []

    const colName = `stage${stage}_behindpercent`

    for(let i = 0; i < rows.length; i++) {
      if(i === 0) {
        rows[i][colName] = 0
        newRows.push(rows[i])
        continue
      }

      newRows.push(rows[i])
    }
    return newRows
  }

}


module.exports = StageCalculations

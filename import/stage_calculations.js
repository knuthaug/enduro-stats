class StageCalculations {

  timeBehind(rows, stage) {
    const newRows = []

    const colName = `stage${stage}_behindms`

    for(let i = 0; i < rows.length; i++) {
      if(i === 0) {
        rows[i][colName] = 0
        newRows.push(rows[i])
        continue
      }
      rows[i][colName] = rows[i].timems - rows[i - 1].timems
      newRows.push(rows[i])
    }
    return newRows
  }
}

module.exports = StageCalculations

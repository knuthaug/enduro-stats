function indexOf (list, prop) {
  return list.findIndex((el) => {
    return el === prop
  })
}

function find (list, prop, value) {
  return list.find((r) => {
    return r[prop] === value
  })
}

function findAllRiders (rows) {
  return rows.map((el) => {
    return el.rider_id
  }).filter((value, index, self) => {
    return self.indexOf(value) === index
  })
}

function maxValue (list, prop) {
  return list.reduce((acc, current) => {
    return current[prop] > acc ? current[prop] : acc
  }, 0)
}

function rowsForRider (list, riderId) {
  return list.filter((r) => {
    return r.rider_id === riderId
  })
}

function stagesForRider (list, riderId) {
  return rowIndexByProp(list, 'rider_id', riderId)
}

function stageIndexesForStage (list, stageNum) {
  return rowIndexByProp(list, 'stage', stageNum)
}

function rowIndexByProp (list, prop, value) {
  return list.sort((a, b) => {
    return a.stage - b.stage
  }).map((r, index) => {
    if (r[prop] === value) {
      return index
    }
  }).filter((e) => {
    return typeof e !== 'undefined'
  })
}

module.exports.indexOf = indexOf
module.exports.maxValue = maxValue
module.exports.rowsForRider = rowsForRider
module.exports.find = find
module.exports.stagesForRider = stagesForRider
module.exports.stageIndexesForStage = stageIndexesForStage
module.exports.findAllRiders = findAllRiders

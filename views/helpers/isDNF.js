module.exports = function isDNF (obj, stage) {
  return obj[`stage${stage}_time`] === 'DNF'
}

module.exports = function isOK (obj, stage) {
  return obj[`stage${stage}_time`] !== 'DNF' && obj[`stage${stage}_time`] !== 'DNS' && obj[`stage${stage}_time`] !== 'ERROR'
}

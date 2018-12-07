module.exports = function isError(obj, stage) {
  return obj[`stage${stage}_time`] === 'ERROR'
}

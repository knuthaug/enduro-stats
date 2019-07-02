module.exports = function isDSQ (obj, stage) {
  return obj[`stage${stage}_time`] === 'DSQ'
}

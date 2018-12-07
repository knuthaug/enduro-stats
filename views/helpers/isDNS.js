module.exports = function isDNS(obj, stage) {
    return obj[`stage${stage}_time`] === 'DNS'
}

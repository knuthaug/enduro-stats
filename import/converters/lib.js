const { ERROR_RANK, DNS_STATUS, DSQ_STATUS, DNF_STATUS, OK_STATUS } = require('../constants.js')
const { convertTimeToMs } = require('../../lib/time.js')

function finalStatus (value) {
  if (value === DNS_STATUS || value === DNF_STATUS || value === DSQ_STATUS) {
    return value
  }

  return OK_STATUS
}

function stageRank (rank) {
  if (rank === 0 || rank === DNS_STATUS || rank === DNF_STATUS) {
    return ERROR_RANK
  }

  return rank
}

function finished (pos) {
  return pos !== DNS_STATUS && pos !== DNF_STATUS
}

function notFinished (pos) {
  return pos === DNS_STATUS || pos === DNF_STATUS
}

function convertTimeMs (time, pos) {
  if (finished(pos)) {
    return convertTimeToMs(time)
  } else if (pos === 0 || pos === '0') {
    return 0
  }

  return 0
}

function findGender(clazz) {
  if(/kvinner/i.test(clazz) || /^k/i.test(clazz)) {
    return 'F'
  }
  return 'M'
}

module.exports.findGender = findGender
module.exports.finalStatus = finalStatus
module.exports.stageRank = stageRank
module.exports.finished = finished
module.exports.notFinished = notFinished
module.exports.convertTimeMs = convertTimeMs

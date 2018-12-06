
function convertMsToTime (seconds) {
  if(seconds === null) {
    seconds = 0
  }

  const sec = ( typeof seconds === 'string') ? seconds : seconds.toString()
  const fractionalSeconds = sec.substr(sec.length - 3, 1)

  const secs = Number(sec.substr(0, sec.length - 3))
  const m = Math.floor(secs % 3600 / 60)
  var s = Math.floor(secs % 3600 % 60)
  return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}.${fractionalSeconds}`
}

module.exports.convertMsToTime = convertMsToTime

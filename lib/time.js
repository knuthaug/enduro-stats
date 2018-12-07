
function convertMsToTime (seconds) {
  if (seconds === null) {
    seconds = 0
  }

  const sec = (typeof seconds === 'string') ? seconds : seconds.toString()
  const fractionalSeconds = sec.substr(sec.length - 3, 1)

  // const secs = Number(sec.substr(0, sec.length - 3))
  const h = Math.floor(((sec / (1000 * 60 * 60)) % 24))
  const m = Math.floor((sec / (1000 * 60)) % 60)
  var s = Math.floor(sec / 1000 % 60)

  if (h) {
    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}.${fractionalSeconds}`
  }
  return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}.${fractionalSeconds}`
}

module.exports.convertMsToTime = convertMsToTime

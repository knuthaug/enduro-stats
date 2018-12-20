
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

function convertTimeToMs (ts) {
  if (ts === null || typeof ts === 'undefined') {
    return 0
  }

  let ms = 0
  if (ts.indexOf('.') !== -1) {
    const frac = ts.substring(ts.indexOf('.') + 1).padEnd(3, '0')
    ms = parseInt(frac, 10)
    ts = ts.slice(0, ts.indexOf('.'))
  }

  const parts = ts.split(/:/)

  if (parts.length === 3) {
    ms += parseInt(parts[0], 10) * 1000 * 60 * 60
    ms += parseInt(parts[1], 10) * 1000 * 60
    ms += parseInt(parts[2], 10) * 1000
    return ms
  } else if (parts.length === 2) {
    ms += parseInt(parts[0], 10) * 1000 * 60
    ms += parseInt(parts[1], 10) * 1000

    return ms
  }

  return ms + parseInt(parts[0], 10) * 1000
}

module.exports.convertMsToTime = convertMsToTime
module.exports.convertTimeToMs = convertTimeToMs

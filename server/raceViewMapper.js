
module.exports = function raceViewMapper (races) {
  const out = {}

  for (let i = 0; i < races.length; i++) {
    if(!out.hasOwnProperty(races[i].year)) {
      out[races[i].year] = []
    }

    out[races[i].year].push(races[i])
  }

  return out
}

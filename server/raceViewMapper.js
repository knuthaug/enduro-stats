
module.exports = function raceViewMapper (races) {
  const out = []

  const sorted = races.sort((a, b) => {
    if (a.year > b.year) {
      return -1
    } else if (a.year < b.year) {
      return 1
    }
    return 0
  })

  for (let i = 0; i < sorted.length; i++) {
    const row = {}
    const year = sorted[i].year

    if (!out.find((r) => {
      return r.year === year
    })) {
      row.year = year
      row.races = sorted.filter((r) => {
        return r.year === year
      })
      row.races = row.races.sort((a, b) => {
        if (a.date < b.date) {
          return -1
        } else if (a.date > b.date) {
          return 1
        }
        return 0
      })
      out.push(row)
    }
  }

  return out
}

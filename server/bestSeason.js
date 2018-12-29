module.exports = (rows) => {
  const years = { }
  for (let i = 0; i < rows.length; i++) {
    if (!years.hasOwnProperty(rows[i].year)) {
      years[rows[i].year] = []
    }

    if (rows[i].time_behind !== 'DNS' && rows[i].time_behind !== 'DNF') {
      years[rows[i].year].push(rows[i].rank)
    }
  }

  const avgs = {}
  Object.keys(years).forEach((y) => {
    const a = years[y].reduce((a, b) => {
      return a + b
    }, 0) / years[y].length
    avgs[y] = {}
    avgs[y].sum = years[y].length - a
    avgs[y].avg = a
  })

  let max = -1000
  let year = 2000
  const keys = Object.keys(avgs)
  for (let i = 0; i < keys.length; i++) {
    if (avgs[keys[i]].sum > max) {
      max = avgs[keys[i]].sum
      year = keys[i]
    }
  }

  if (year === 2000) {
    return { year: 0, avg: 0 }
  }
  return { year, avg: parseFloat(avgs[year].avg, 10).toFixed(1) }
}

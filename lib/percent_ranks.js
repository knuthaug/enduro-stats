const { toNumber } = require('../server/riderViewMapper')
const compareAsc = require('date-fns/compare_asc')
const parse = require('date-fns/parse')

function percentRanks (races, ridersPerClass) {
  return races.map((r) => {
    return Object.assign(r, { count: ridersPerClass[r.race] })
  }).map((r) => {
    r.details = r.details.map((d) => {
      d.percent_rank = (d.rank / r.count) * 100
      return d
    })

    r.chartData = JSON.stringify(r.details.map((e) => {
      return [toNumber(e.name), e.percent_rank]
    }))

    // avg for percent_rank
    r.avg_percent_rank = r.details.reduce((acc, cur) => {
      return acc + cur.percent_rank
    }, 0) / r.details.length

    return r
  }).sort((a, b) => {
    return compareAsc(parse(b.date), parse(a.date))
  })
}

module.exports = { percentRanks }

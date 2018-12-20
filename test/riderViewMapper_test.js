const tap = require('tap')
const fs = require('fs')
const path = require('path')

const mapper = require('../server/riderViewMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-for-rider.json')).toString())

const r = mapper(data)

tap.test('results are mapped to flat array', (t) => {
  t.equals(r.length, 13, 'Has one entry per race')
  t.end()
})

tap.test('Data fields for mapped array', (t) => {
  t.equals(r[0].date, '2013-06-06', 'Date for race')
  t.equals(r[0].raceName, 'NesbyEnduro', 'Name for race')
  t.equals(r[0].rank, 1, 'rank in race')
  t.equals(r[0].time, '17:15.0', 'total time in race')
  t.equals(r[0].class, 'Menn senior', 'total time in race')
  //console.log(r)
  t.end()
})


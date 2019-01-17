const tap = require('tap')
const fs = require('fs')
const path = require('path')

const { riderViewMapper } = require('../server/riderViewMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-for-rider.json')).toString())

const r = riderViewMapper(data)

tap.test('results are mapped to flat array', (t) => {
  t.equals(r.length, 23, 'Has one entry per race')
  t.end()
})

tap.test('Data fields for mapped array', (t) => {
  t.equals(r[0].date, '2013-06-06', 'Date for race')
  t.equals(r[0].raceName, 'NesbyEnduro', 'Name for race')
  t.equals(r[0].rank, 1, 'rank in race')
  t.equals(r[0].time, '17:15.0', 'total time in race')
  t.equals(r[0].class, 'Menn senior', 'total time in race')
  t.end()
})

tap.test('Data fields for race details', (t) => {
  t.equals(r[0].details[0].name, 'SS1', 'stage name')
  t.equals(r[0].details[0].time, '05:37.0', 'stage time')
  t.equals(r[0].details[0].rank, 3, 'stage rank')
  t.equals(r[0].details[0].time_behind, '00:11.0', 'stage time behind')
  t.end()
})

tap.test('calculate average rank for stages', (t) => {
  t.equals(r[0].avg_rank, '1.6', 'stage rank averaged, one decimal place')
  t.equals(r[0].avg_time_behind, '00:10.8', 'behind_leader_ms averaged')
  t.equals(r[0].avg_percent_behind, '7.9', 'avg percent behind, one decimal')
  t.end()
})

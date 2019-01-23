const tap = require('tap')
const fs = require('fs')
const path = require('path')

const mapper = require('../server/fullResultViewMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-complete2.json')).toString())
const [stages, r] = mapper(['Menn', 'Kvinner'], data)

tap.test('All results in one list', (t) => {
  t.equals(r.length, 37, 'all results in one list')
  t.end()
})

tap.test('new stages placements calculated', (t) => {
  t.equals(r[0].stage1_rank, 3, 'first stage, original is correct')
  t.equals(r[0].stage2_rank, 1, 'second stage, original is correct for male winner')
  const firstWoman = r[24]

  t.equals(firstWoman.stage1_rank, 29, 'fastest woman is 25 in first stage')
  t.equals(firstWoman.stage1_time_behind, '02:00', 'fastest woman is 02:00 behind in first stage')
  t.end()
})



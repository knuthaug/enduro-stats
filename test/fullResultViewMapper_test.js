const tap = require('tap')
const fs = require('fs')
const path = require('path')
const deepFreeze = require('deep-freeze')

const mapper = require('../server/fullResultViewMapper.js')
const data = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-complete2.json')).toString()))
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
  t.equals(firstWoman.stage1_behind_leader, '02:11.0', 'fastest woman is 02:11 behind in first stage')
  t.end()
})

tap.test('race acc behind is calcultaed', (t) => {
  t.equals(r[0].acc_time_behind_ms, 0, 'acc time behind for overall winner is zero')
  t.equals(r[0].acc_time_behind, '00:00.0', 'acc time behind for overall winner is zero')

  t.equals(r[1].acc_time_behind_ms, 44075, 'acc time behind for overall second i 44 s')
  t.equals(r[1].acc_time_behind, '00:44.0', 'acc time behind for overall second is 44s')

  t.end()
})

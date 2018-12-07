const tap = require('tap')
const fs = require('fs')
const path = require('path')

const mapper = require('../server/resultViewMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-complete.json')).toString())
const data2 = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-complete2.json')).toString())
const [stages, r] = mapper(['Menn', 'Kvinner'], data)
const [stages2, r2] = mapper(['Menn', 'Kvinner'], data2)

tap.test('results are mapped to class names', (t) => {
  t.equals(r.hasOwnProperty('Menn'), true, 'Has class Menn')
  t.equals(r.hasOwnProperty('Kvinner'), true, 'Has class Kvinner')
  t.end()
})

tap.test('returns overview of stages for race', async t => {
  t.equals(stages.length, 6)
  t.equals(stages[0], 1)
  t.equals(stages[stages.length - 1], 6)
  t.end()
})

tap.test('total winner in class is first in result array', (t) => {
  const men = r.Menn
  t.equals(men[0].final_rank, 1, 'total rank 1 is first')
  t.equals(men[0].stage1_time, '07:30.7', 'stage times are per stage')
  t.equals(men[0].stage1_rank, 1, 'stage rank is included')
  t.equals(men[0].stage2_rank, 3, 'stage rank is included')
  t.equals(men[0].acc_time_behind, '00:00.0', 'total time behind is included')

  t.equals(men[1].acc_time_behind, '01:51.4', 'total time behind is included')
  t.end()
})

tap.test('For stages either DNF or DNS, stage_time is replaced', (t) => {
  const men = r.Menn
  t.equals(men[68].stage6_time, 'DNF', 'stage time of zero is DNF')
  t.equals(men[74].stage6_time, 'DNS', 'stage time of zero is DNS if status is DNS')
  t.end()
})



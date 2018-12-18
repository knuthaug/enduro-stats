const tap = require('tap')
const StageCalculations = require('../import/normal_stage_calculations.js')
const path = require('path')
const fs = require('fs')

const c = new StageCalculations()
const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-normal-menn.json')))
const result = c.differentials(rows)

tap.test('original data is always returned', async t => {

  t.equals(result[0].rider_id, 3, 'rider_id is the same')
  t.equals(result[0].race_id, 1, 'race id is the same')
  t.equals(result[0].stage, 1, 'stage number is 1')
  t.equals(result[0].stage_rank, 1, 'rank is 1')
  t.equals(result[0].class, 'Menn senior', 'class is menn')
  t.equals(result[0].stage_time_ms, 143000, 'stage_time_ms is stage time for first stage')
  t.equals(result[0].time, '2:23')
  t.equals(result[0].status, 'OK')
  t.end()
})

tap.test('acc_time_ms is calculated', async t => {

  t.equals(result[0].acc_time_ms, 143000, 'acc_time_ms is stage time for first stage')
  t.equals(result[0].rider_id, 3)
  //console.log(result[63])
  t.equals(result[63].rider_id, 3)
  t.equals(result[63].stage_time_ms, 105000, 'stage time for second stage')
  t.equals(result[63].acc_time_ms, 248000, 'acc_time_ms for second stage is first plus second')
  t.end()
})


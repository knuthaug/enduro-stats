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
  // console.log(result[63])
  t.equals(result[63].rider_id, 3)
  t.equals(result[63].stage_time_ms, 105000, 'stage time for second stage')
  t.equals(result[63].acc_time_ms, 248000, 'acc_time_ms for second stage is first plus second')
  t.end()
})

tap.test('make sure all riders have all stages', async t => {

  for(let i = 1; i < 6; i++) {
    let stageLength = rows.filter((r) => {
      return r.stage === i
    }).length
    t.equals(stageLength, 61, 'all riders have all stages set')
  }

  t.end()
})

tap.test('calculate final rank based on acc_time_ms for last stage', async t => {

  const first = result.find((r) => {
    return r.rider_id === 5 && r.stage === 5
  })

  const second = result.find((r) => {
    return r.rider_id === 12 && r.stage === 5
  })

  const third = result.find((r) => {
    return r.rider_id === 7 && r.stage === 5
  })

  t.equals(first.final_rank, 1, 'lowest time gets stage_rank 1')
  t.equals(second.final_rank, 2, 'second lowest time gets stage_rank 2')
  t.equals(third.final_rank, 3, 'third lowest time gets stage_rank 3')
  t.end()
})

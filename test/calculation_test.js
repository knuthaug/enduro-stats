const tap = require('tap')
const StageCalculations = require('../import/stage_calculations.js')
const path = require('path')
const fs = require('fs')

const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
// const rows2 = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))

const c = new StageCalculations()

tap.test('original data is always returned', async t => {
  const result = c.differentials(rows, 1)
  t.equals(result[0].rider_id, 22, 'rider_id is the same')
  t.equals(result[0].race_id, 1, 'race id is the same')
  t.equals(result[0].stage, 1, 'stage number is 1')
  t.equals(result[0].rank, 1, 'rank is 1')
  t.equals(result[0].class, 'Menn', 'class is menn')
  t.equals(result[0].acc_time_ms, 450700, 'acc_time_ms is stage time for first stage')
  t.equals(result[0].time, '00:07:30.7')
  t.equals(result[0].status, 'OK')
})

tap.test('calculate time per stage from acc_time_ms', async t => {
  const result = c.differentials(rows, 1)
  t.equals(result[0].stage_time_ms, 450700, 'acc_time_ms is stage time for first stage')

  t.equals(result[80].stage_time_ms, 321320)
  t.equals(result[80].acc_time_ms, 772020, 'stage for 2 is total time up to point')

  t.equals(result[156].stage_time_ms, 464920, 'stage time is this stages acc time minus previous ')
  t.equals(result[156].acc_time_ms, 1236940, 'stage for 4 is total time up to point')
})

tap.test('calculate stage rank based on time_ms per stage', async t => {
  const result = c.differentials(rows, 1)
  t.equals(result[0].stage_rank, 1, 'lowest time gets stage_rank 1')
  t.equals(result[1].stage_rank, 2, 'second lowest time gets stage_rank 2')

  // console.log(result[78])

  t.equals(result[80].stage_rank, 3, 'stage rank 3 for 3rd lowest time of stage')
  t.equals(result[79].stage_rank, 2, 'stage_rank 2 for second lowest time')
  t.equals(result[78].stage_rank, 1, 'stage_rank 1 for lowest time')
})

tap.test('calculate time behind leader', async t => {
  const result = c.differentials(rows, 1)
  t.equals(result[0].behind_leader_ms, 0, 'stage winner is 0 behind leader')
  t.equals(result[1].behind_leader_ms, 20300, 'stage second is time_ms behind leader for stage')
  t.equals(result[2].behind_leader_ms, 33200, '3rd is more behind leader')

  // 321320, 340550
  t.equals(result[78].behind_leader_ms, 0, 'stage winner is zero behind leader')
  t.equals(result[79].behind_leader_ms, 6240)
  t.equals(result[80].behind_leader_ms, 15750)

  t.equals(result[result.length - 1].behind_leader_ms, 0) // DNS in all stages
})

tap.test('calculate accumulated time per stage in ms', async t => {
  const result = c.differentials(rows, 1)
  t.equals(result[0].acc_time_ms, 450700)
  t.equals(result[1].acc_time_ms, 471000)
  t.equals(result[2].acc_time_ms, 483900)

  t.equals(result[result.length - 1].acc_time_ms, 0) //DNS
  t.end()
})

tap.test('Misc. tests', async t => {
  const result = c.differentials(rows, 1)

  t.equals(result[392].acc_time_ms, 2561730) //total winner
  t.equals(result[392].rank, 1, 'total winner has rank of 1') //total winner
  //  t.equals(result[394].acc_time_behind, 485880)
  t.equals(result[394].acc_time_ms, 2673180)
  t.equals(result[394].behind_leader_ms, 50330)
  t.equals(result[394].rank, 2)
  t.end()
})

tap.test('calculate accumulated time behind in total in ms', async t => {
  const result = c.differentials(rows, 1)

  t.equals(result[392].acc_time_behind, 0) //total winner
  t.equals(result[392].rank, 1, 'total winner has rank of 1') //total winner
  t.equals(result[394].acc_time_behind, 111450)
  t.equals(result[394].behind_leader_ms, 50330)
  t.equals(result[394].rank, 2)
  t.end()
})

const tap = require('tap')
const StageCalculations = require('../import/stage_calculations.js')
const path = require('path')
const fs = require('fs')

const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
const rows2 = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))

const c = new StageCalculations()

tap.test('original data is always returned', async t => {

  const result = c.differentials(rows, 1)
  t.equals(result[0].rider_id, 22, 'id is the same')
  t.equals(result[0].race_id, 1, 'race id is the same')
  t.equals(result[0].stage, 1)
  t.equals(result[0].rank, 1)
  t.equals(result[0].class, 'Menn')
  t.equals(result[0].timems, 450700)
  t.equals(result[0].time, '00:07:30.7')
  t.equals(result[0].status, 'OK')
})

tap.test('calculate time behind leader', async t => {

  const result = c.differentials(rows, 1)
  t.equals(result[0].behind_leader_ms, 0, 'stage winner is 0 behind leader')
  t.equals(result[1].behind_leader_ms, 20300)
  t.equals(result[2].behind_leader_ms, 33200)

  //console.log(rows[78])
  t.equals(result[78].behind_leader_ms, 0)
  t.equals(result[79].behind_leader_ms, 23890)
  t.equals(result[80].behind_leader_ms, 39530)

  t.equals(result[result.length - 1].behind_leader_ms, 0) //DNS in all stages
})

tap.test('calculate accumulated time per stage in ms', async t => {
  const result = c.differentials(rows, 1)
  t.equals(result[0].acc_time, 450700)
  t.equals(result[1].acc_time, 471000)
  t.equals(result[2].acc_time, 483900)

  t.equals(result[78].acc_time, 1222720)
  t.equals(result[79].acc_time, 1280010)
  t.equals(result[80].acc_time, 1282550)

  t.equals(result[result.length - 1].acc_time, 0) //DNS
  t.end()
})

tap.test('calculate accumulated time behind in total in ms', async t => {
  const result = c.differentials(rows, 1)
  //console.log(result[391])

  t.equals(result[390].acc_time_behind, 0) //total winner
  t.equals(result[390].total_rank, 1) //total winner
  t.equals(result[391].acc_time_behind, 485880)
  t.equals(result[391].acc_time, 9142710)
  t.equals(result[391].behind_leader_ms, 111450)
  t.equals(result[391].total_rank, 2)
  t.end()
})



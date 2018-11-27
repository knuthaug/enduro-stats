const tap = require('tap')
const StageCalculations = require('../import/stage_calculations.js')
const path = require('path')
const fs = require('fs')

const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
const rows2 = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))

const c = new StageCalculations()

tap.test('calculate time behind leader', async t => {

  const result = c.differentials(rows, 1)
  t.equals(result[0].behindleaderms, 0)
  t.equals(result[1].behindleaderms, 20300)
  t.equals(result[2].behindleaderms, 33200)

  //console.log(rows[78])
  t.equals(result[78].behindleaderms, 0)
  t.equals(result[79].behindleaderms, 23890)
  t.equals(result[80].behindleaderms, 39530)

  t.equals(result[result.length - 1].behindleaderms, 0) //DNS in all stages
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
  t.equals(result[390].acc_time_behind, 0) //total winner
  t.equals(result[390].total_rank, 1) //total winner
  t.equals(result[391].acc_time_behind, 485880)
  t.equals(result[391].total_rank, 2) 

  t.end()
})



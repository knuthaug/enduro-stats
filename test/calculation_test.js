const tap = require('tap')
const StageCalculations = require('../import/stage_calculations.js')
const path = require('path')
const fs = require('fs')

const c = new StageCalculations()

tap.test('original data is always returned', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equals(result[0].rider_id, 22, 'rider_id is the same')
  t.equals(result[0].race_id, 1, 'race id is the same')
  t.equals(result[0].stage, 1, 'stage number is 1')
  t.equals(result[0].rank, 1, 'rank is 1')
  t.equals(result[0].class, 'Menn', 'class is menn')
  t.equals(result[0].acc_time_ms, 450700, 'acc_time_ms is stage time for first stage')
  t.equals(result[0].time, '00:07:30.7')
  t.equals(result[0].status, 'OK')
  t.end()
})

tap.test('calculate time per stage from acc_time_ms', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equals(result[0].stage_time_ms, 450700, 'acc_time_ms is stage time for first stage')

  t.equals(result[80].stage_time_ms, 321320)
  t.equals(result[80].acc_time_ms, 772020, 'stage for 2 is total time up to point')

  t.equals(result[156].stage_time_ms, 464920, 'stage time is this stages acc time minus previous ')
  t.equals(result[156].acc_time_ms, 1236940, 'stage for 4 is total time up to point')
  t.end()
})

tap.test('calculate stage rank based on time_ms per stage', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equals(result[0].stage_rank, 1, 'lowest time gets stage_rank 1')
  t.equals(result[1].stage_rank, 2, 'second lowest time gets stage_rank 2')

  // console.log(result[78])

  t.equals(result[80].stage_rank, 3, 'stage rank 3 for 3rd lowest time of stage')
  t.equals(result[79].stage_rank, 2, 'stage_rank 2 for second lowest time')
  t.equals(result[78].stage_rank, 1, 'stage_rank 1 for lowest time')
  t.end()
})

tap.test('calculate final rank based on acc_time_ms for last stage', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)

  const first = result.find((r) => {
    return r.rider_id === 22 && r.stage === 6
  })

  const second = result.find((r) => {
    return r.rider_id === 26 && r.stage === 6
  })

  const third = result.find((r) => {
    return r.rider_id === 25 && r.stage === 6
  })

  t.equals(first.final_rank, 1, 'lowest time gets stage_rank 1')
  t.equals(second.final_rank, 2, 'second lowest time gets stage_rank 2')
  t.equals(third.final_rank, 3, 'third lowest time gets stage_rank 3')
  t.end()
})

tap.test('final rank should reflect bad records', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))
  const res = c.differentials(rows)

  const badRecord = res.find((r) => {
    return r.rider_id === 723 && r.stage === 5
  })

  t.equals(badRecord.status, 'ERROR', 'status error for bad records')
  t.equals(badRecord.final_rank, 35, 'error gets rank last rank in race')
  t.end()
})

tap.test('DNS/DNF records must have final_rank set', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))
  const res = c.differentials(rows)

  const dns = res.find((r) => {
    return r.rider_id === 697 && r.stage === 5
  })

  t.equals(dns.final_rank, 34, 'DNS gets rank last rank in race')
  t.end()
})

tap.test('calculate time behind leader', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equals(result[0].behind_leader_ms, 0, 'stage winner is 0 behind leader')
  t.equals(result[1].behind_leader_ms, 20300, 'stage second is time_ms behind leader for stage')
  t.equals(result[2].behind_leader_ms, 33200, '3rd is more behind leader')

  // 321320, 340550
  t.equals(result[78].behind_leader_ms, 0, 'stage winner is zero behind leader')
  t.equals(result[79].behind_leader_ms, 6240)
  t.equals(result[80].behind_leader_ms, 15750)

  t.equals(result[result.length - 1].behind_leader_ms, 0) // DNS in all stages
  t.end()
})

tap.test('calculate accumulated time per stage in ms', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equals(result[0].acc_time_ms, 450700)
  t.equals(result[1].acc_time_ms, 471000)
  t.equals(result[2].acc_time_ms, 483900)

  t.equals(result[result.length - 1].acc_time_ms, 0) // DNS
  t.end()
})

tap.test('Misc. tests', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)

  t.equals(result[392].acc_time_ms, 2561730) // total winner
  t.equals(result[392].rank, 1, 'total winner has rank of 1') // total winner
  //  t.equals(result[394].acc_time_behind, 485880)
  t.equals(result[394].acc_time_ms, 2673180)
  t.equals(result[394].behind_leader_ms, 50330)
  t.equals(result[394].rank, 2)
  t.end()
})

tap.test('calculate accumulated time behind in total in ms', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)

  t.equals(result[392].acc_time_behind, 0) // total winner
  t.equals(result[392].rank, 1, 'total winner has rank of 1') // total winner
  t.equals(result[394].acc_time_behind, 111450)
  t.equals(result[394].behind_leader_ms, 50330)
  t.equals(result[394].rank, 2)
  t.end()
})

tap.test('Make sure all riders have all stages represented', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))
  const res = c.differentials(rows)

  t.equals(res[0].rank, 1)

  const ro = res.filter((r) => {
    return r.rider_id === res[0].rider_id
  })

  // console.log(rows[1])
  t.equals(ro[2].rank, 999)
  t.equals(ro.length, 5)
  t.end()
})

tap.test('Handle stages where there are times and dnf/error status', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn-traktor2015.json')))
  const res = c.differentials(rows)

  const problem = res.find((r) => {
    return r.rider_id === 141 && r.stage === 5
  })

  t.equals(problem.final_rank, 111)
  // t.equals(ro.length, 5)
  t.end()
})

tap.test('Handle races in non-accumulative mode', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn-nesbyen-2014.json')))
  const res = c.differentials(rows, { acc: false })

  t.equals(res[0].stage_time_ms, 466068, 'milliseconds per stage')
  t.equals(res[0].stage_rank, 1, 'milliseconds per stage')
  t.equals(res[0].acc_time_ms, 466068, 'acc time for first stage is stage_time for stage')

  const found = res.filter((r) => {
    return r.rider_id === 38
  })

  t.equals(found[1].stage, 2, 'stage is 2')
  t.equals(found[1].stage_time_ms, 493241, 'stage is 2')
  t.equals(found[1].acc_time_ms, 959309, 'acc_time for second stage is previous stage plus this')

  //final_rank
  t.equals(found[3].final_rank, 6, 'final rank is correct')
  t.end()
})

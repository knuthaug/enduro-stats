const tap = require('tap')
const StageCalculations = require('../import/accumulated_stage_calculations.js')
const path = require('path')
const fs = require('fs')

const c = new StageCalculations()

tap.test('original data is always returned', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equal(result[0].rider_id, 22, 'rider_id is the same')
  t.equal(result[0].race_id, 1, 'race id is the same')
  t.equal(result[0].stage, 1, 'stage number is 1')
  t.equal(result[0].rank, 1, 'rank is 1')
  t.equal(result[0].class, 'Menn', 'class is menn')
  t.equal(result[0].acc_time_ms, 450700, 'acc_time_ms is stage time for first stage')
  t.equal(result[0].time, '00:07:30.7')
  t.equal(result[0].status, 'OK')
  t.end()
})

tap.test('calculate time per stage from acc_time_ms', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equal(result[0].stage_time_ms, 450700, 'acc_time_ms is stage time for first stage')

  t.equal(result[80].stage_time_ms, 321320)
  t.equal(result[80].acc_time_ms, 772020, 'stage for 2 is total time up to point')

  t.equal(result[156].stage_time_ms, 464920, 'stage time is this stages acc time minus previous ')
  t.equal(result[156].acc_time_ms, 1236940, 'stage for 4 is total time up to point')
  t.end()
})

tap.test('calculate stage rank based on time_ms per stage', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equal(result[0].stage_rank, 1, 'lowest time gets stage_rank 1')
  t.equal(result[1].stage_rank, 2, 'second lowest time gets stage_rank 2')

  // console.log(result[78])

  t.equal(result[80].stage_rank, 3, 'stage rank 3 for 3rd lowest time of stage')
  t.equal(result[79].stage_rank, 2, 'stage_rank 2 for second lowest time')
  t.equal(result[78].stage_rank, 1, 'stage_rank 1 for lowest time')
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

  t.equal(first.final_rank, 1, 'lowest time gets stage_rank 1')
  t.equal(second.final_rank, 2, 'second lowest time gets stage_rank 2')
  t.equal(third.final_rank, 3, 'third lowest time gets stage_rank 3')
  t.end()
})

tap.test('final rank should reflect bad records', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))
  const res = c.differentials(rows)

  const badRecord = res.find((r) => {
    return r.rider_id === 723 && r.stage === 5
  })

  t.equal(badRecord.status, 'ERROR', 'status error for bad records')
  t.equal(badRecord.final_rank, 32, 'error gets ranked with dns/dnf last rank in race')
  t.end()
})

tap.test('DNS/DNF records must have final_rank set', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))
  const res = c.differentials(rows)

  const dns = res.find((r) => {
    return r.rider_id === 697 && r.stage === 5
  })

  t.equal(dns.final_rank, 35, 'DNS gets rank last rank in race')
  t.end()
})

tap.test('calculate time behind leader', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equal(result[0].behind_leader_ms, 0, 'stage winner is 0 behind leader')
  t.equal(result[1].behind_leader_ms, 20300, 'stage second is time_ms behind leader for stage')
  t.equal(result[2].behind_leader_ms, 33200, '3rd is more behind leader')

  // 321320, 340550
  t.equal(result[78].behind_leader_ms, 0, 'stage winner is zero behind leader')
  t.equal(result[79].behind_leader_ms, 6240)
  t.equal(result[80].behind_leader_ms, 15750)

  t.equal(result[result.length - 1].behind_leader_ms, 0) // DNS in all stages
  t.end()
})

tap.test('calculate accumulated time per stage in ms', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)
  t.equal(result[0].acc_time_ms, 450700)
  t.equal(result[1].acc_time_ms, 471000)
  t.equal(result[2].acc_time_ms, 483900)

  t.equal(result[result.length - 1].acc_time_ms, 0) // DNS
  t.end()
})

tap.test('Misc. tests', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)

  t.equal(result[392].acc_time_ms, 2561730) // total winner
  t.equal(result[392].rank, 1, 'total winner has rank of 1') // total winner
  //  t.equal(result[394].acc_time_behind, 485880)
  t.equal(result[394].acc_time_ms, 2673180)
  t.equal(result[394].behind_leader_ms, 50330)
  t.equal(result[394].rank, 2)
  t.end()
})

tap.test('calculate accumulated time behind in total in ms', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn.json')))
  const result = c.differentials(rows)

  t.equal(result[392].acc_time_behind, 0) // total winner
  t.equal(result[392].rank, 1, 'total winner has rank of 1') // total winner
  t.equal(result[394].acc_time_behind, 111450)
  t.equal(result[394].behind_leader_ms, 50330)
  t.equal(result[394].rank, 2)
  t.end()
})

tap.test('Make sure all riders have all stages represented', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn2.json')))
  const res = c.differentials(rows)

  t.equal(res[0].rank, 1)

  const ro = res.filter((r) => {
    return r.rider_id === res[0].rider_id
  })

  // console.log(rows[1])
  t.equal(ro[2].rank, 999)
  t.equal(ro.length, 5)
  t.end()
})

tap.test('Handle stages where there are times and dnf/error status', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn-traktor2015.json')))
  const res = c.differentials(rows)

  const problem = res.find((r) => {
    return r.rider_id === 141 && r.stage === 5
  })

  t.equal(problem.final_rank, 108)
  t.end()
})

tap.test('fine tune dns/dnf continued', async t => {
  const c = new StageCalculations()
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn-oslo-2015.json')))
  const result = c.differentials(rows)
  const partialRider = result.filter((r) => {
    return r.rider_id === 5730
  })

  t.equal(partialRider[0].status, 'OK', 'OK for first stage')
  t.equal(partialRider[1].status, 'OK', 'OK for second stage')
  t.equal(partialRider[2].status, 'OK', 'DNF for third stage')
  t.equal(partialRider[3].status, 'DNF', 'DNF for fourth stage')
  t.equal(partialRider[4].status, 'DNS', 'DNF for fourth stage')
  t.equal(partialRider[4].final_status, 'DNF', 'DNF as final_status')
  t.end()
})

tap.test('Misc. tests', async t => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/nesbyen-2015-complete.json')))
  const result = c.differentials(rows)
  const problem = result.filter((r) => {
    return r.rider_id === 3182
  })

  t.equal(problem[problem.length - 1].final_rank, 135, 'DNS in first stage only means no finishing time')
  t.equal(problem[problem.length - 1].acc_time_ms, 0, 'DNS in first stage only means no finishing time')
  t.end()
})

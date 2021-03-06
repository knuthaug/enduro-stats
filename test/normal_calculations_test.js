const tap = require('tap')
const StageCalculations = require('../import/normal_stage_calculations.js')
const path = require('path')
const fs = require('fs')

const c = new StageCalculations()
const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-normal-menn.json')))
const result = c.differentials(rows)

tap.test('original data is always returned', async t => {
  t.equal(result[0].rider_id, 3, 'rider_id is the same')
  t.equal(result[0].race_id, 1, 'race id is the same')
  t.equal(result[0].stage, 1, 'stage number is 1')
  t.equal(result[0].stage_rank, 1, 'rank is 1')
  t.equal(result[0].class, 'Menn senior', 'class is menn')
  t.equal(result[0].stage_time_ms, 143000, 'stage_time_ms is stage time for first stage')
  t.equal(result[0].time, '2:23')
  t.equal(result[0].status, 'OK')
  t.end()
})

tap.test('acc_time_ms is calculated', async t => {
  t.equal(result[0].acc_time_ms, 143000, 'acc_time_ms is stage time for first stage')
  t.equal(result[0].rider_id, 3, 'rider_id 3 is first')
  // console.log(result[63])
  t.equal(result[64].rider_id, 4, 'rider_id 4 is found')
  t.equal(result[64].stage_time_ms, 105000, 'stage time for second stage')
  t.equal(result[64].acc_time_ms, 248000, 'acc_time_ms for second stage is first plus second')
  t.end()
})

tap.test('acc_time_behind is calculated for last stage', async t => {
  const first = result.find((r) => {
    return r.rider_id === 5 && r.stage === 5
  })

  const second = result.find((r) => {
    return r.rider_id === 12 && r.stage === 5
  })

  t.equal(first.acc_time_behind, 0, 'winner is not behind')
  t.equal(second.acc_time_behind, 7000, 'second is behind')
  t.end()
})

tap.test('make sure all riders have all stages', async t => {
  for (let i = 1; i < 6; i++) {
    const stageLength = rows.filter((r) => {
      return r.stage === i
    }).length
    t.equal(stageLength, 61, 'all riders have all stages set')
  }

  t.end()
})

tap.test('change stage time of zero into status ERROR', async t => {
  const problem = result.find((r) => {
    return r.rider_id === 58 && r.stage === 1
  })
  t.equal(problem.stage_time_ms, 0, 'time is zero')
  t.equal(problem.status, 'ERROR', 'status is error')
  t.equal(problem.acc_time_ms, 0, 'acc_time_ms is zero')
  t.end()
})

tap.test('behind_leader_ms is calculated', async t => {
  t.equal(result[0].behind_leader_ms, 0, 'stage winner is 0 seconds behind leader')
  t.equal(result[0].stage_rank, 1, 'shared first in stage')
  t.equal(result[1].behind_leader_ms, 0, 'stage second is 0 seconds behind leader')
  t.equal(result[1].stage_rank, 1, 'shared first in stage')

  t.equal(result[2].behind_leader_ms, 2000, 'stage second is 2 seconds behind leader')
  t.equal(result[2].behind_leader_percent, '1.4', 'stage second is 1.9% behind leader')
  t.equal(result[2].stage_rank, 3, 'third is 3')
  t.end()
})

tap.test('behind_leader_ms handles dns and then times', async t => {
  const c = new StageCalculations()
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-traktor2017-kvinner.json')))
  const result = c.differentials(rows)

  t.equal(result[0].behind_leader_ms, 0, 'stage winner is 0 seconds behind leader')
  t.equal(result[0].stage_rank, 1, 'shared first in stage')

  t.equal(result[1].behind_leader_ms, 3000, 'stage second is 2 seconds behind leader')
  t.equal(result[1].stage_rank, 2, 'shared first in stage')

  const lastStage = result.filter((r) => {
    return r.stage === 6
  }).sort((a, b) => {
    return a.final_rank - b.final_rank
  })

  t.equal(lastStage[0].final_rank, 1, 'final_rank is 1')
  t.equal(lastStage[0].acc_time_behind, 0, 'final_rank is 1')
  t.equal(lastStage[1].acc_time_behind, 36000, 'final_rank is 1')
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

  t.equal(first.final_rank, 1, 'lowest time gets stage_rank 1')
  t.equal(second.final_rank, 2, 'second lowest time gets stage_rank 2')
  t.equal(third.final_rank, 3, 'third lowest time gets stage_rank 3')
  t.end()
})

tap.test('fine tune dns/dnf', async t => {
  const c = new StageCalculations()
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn-oslo-2013.json')))
  const result = c.differentials(rows)
  const partialRider = result.filter((r) => {
    return r.rider_id === 1013
  })

  t.equal(partialRider[0].status, 'OK', 'OK for first stage')
  t.equal(partialRider[1].status, 'OK', 'OK for second stage')
  t.equal(partialRider[2].status, 'DNF', 'DNF for third stage')
  t.equal(partialRider[3].status, 'DNS', 'DNF for fourth stage')
  t.equal(partialRider[4].status, 'DNS', 'DNF for fourth stage')
  t.equal(partialRider[4].final_status, 'DNF', 'DNF as final_status for partial race')
  t.end()
})

tap.test('fine tune dns/dnf', async t => {
  const c = new StageCalculations()
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-junior-drammen-2019.json')))
  const result = c.differentials(rows)
  const partialRider = result.filter((r) => {
    return r.rider_id === 13233
  })

  t.equal(partialRider[0].status, 'DSQ', 'DSQ for first stage')
  t.equal(partialRider[1].status, 'DSQ', 'DSQfor second stage')
  t.equal(partialRider[2].status, 'DSQ', 'DSQ for third stage')
  t.equal(partialRider[3].status, 'DSQ', 'DSQ for fourth stage')
  t.equal(partialRider[4].status, 'DSQ', 'DSQ for fourth stage')
  t.equal(partialRider[4].final_status, 'DSQ', 'DSQ as final_status for DQ race')
  t.end()
})

tap.test('handle weird dns/dnf in drammen 2019', async t => {
  const c = new StageCalculations()
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn-master-drammen-2019.json')))
  const result = c.differentials(rows)

  const firstRider = result.filter((r) => {
    return r.rider_id === 11
  })

  t.equal(firstRider[firstRider.length - 1].final_rank, 1, '1st rider')
  t.equal(firstRider[firstRider.length - 1].acc_time_behind, 0, '1st rider is not behind')

  const secondRider = result.filter((r) => {
    return r.rider_id === 12
  })

  t.equal(secondRider[secondRider.length - 1].final_rank, 2, '2nd rider')
  t.equal(secondRider[secondRider.length - 1].acc_time_behind, 27000, '2nd rider is behind')
})

tap.test('fine tune dns/dnf contiued', async t => {
  const c = new StageCalculations()
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-menn-drammen-2014.json')))
  const result = c.differentials(rows)

  const okRider = result.filter((r) => {
    return r.rider_id === 1697
  })

  t.equal(okRider[0].status, 'OK', 'OK for first stage')
  t.equal(okRider[1].status, 'OK', 'OK for second stage')
  t.equal(okRider[2].status, 'OK', 'OK for third stage')
  t.equal(okRider[3].status, 'OK', 'OK for fourth stage')
  t.equal(okRider[3].final_status, 'OK', 'OK as final_status for all stages completed')

  const partialRider = result.filter((r) => {
    return r.rider_id === 803
  })

  t.equal(partialRider[0].status, 'OK', 'OK for first stage')
  t.equal(partialRider[1].status, 'OK', 'OK for second stage')
  t.equal(partialRider[2].status, 'DNF', 'DNF for third stage')
  t.equal(partialRider[3].status, 'DNS', 'DNF for fourth stage')
  t.equal(partialRider[3].final_status, 'DNF', 'DNF as final_status for aborted race')

  const dnsRider = result.filter((r) => {
    return r.rider_id === 1715
  })

  t.equal(dnsRider[0].status, 'DNS', 'DNS for first stage')
  t.equal(dnsRider[1].status, 'DNS', 'DNS for second stage')
  t.equal(dnsRider[2].status, 'DNS', 'DNS for third stage')
  t.equal(dnsRider[3].status, 'DNS', 'DNS for fourth stage')
  t.equal(dnsRider[3].final_status, 'DNS', 'DNS as final_status for no stages ridden')
  t.end()
})

tap.test('fine tune dns/dnf continued', async t => {
  const c = new StageCalculations()
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, './data/race-results-explorer-kvinner-nesfjella.json')))
  const result = c.differentials(rows)

  const okRider = result.filter((r) => {
    return r.rider_id === 17717
  })

  t.equal(okRider[5].final_status, 'DNF', 'DNF as two stages are DNS')
  t.end()
})

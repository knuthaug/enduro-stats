const tap = require('tap')
const fs = require('fs')
const path = require('path')

const mapper = require('../../server/resultViewMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/race-results-complete.json')).toString())
const data2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/race-results-complete2.json')).toString())
const data3 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/race-results-complete-class-diff.json')).toString())
const [stages, r, graphs] = mapper(['Menn', 'Kvinner'], data)
const [stages2, r2] = mapper(['Menn', 'Kvinner'], data2)
const [stages3, r3] = mapper(['Menn senior', 'Sport'], data3)

tap.test('results are mapped to class names', (t) => {
  t.equal(r.hasOwnProperty('Menn'), true, 'Has class Menn')
  t.equal(r.hasOwnProperty('Kvinner'), true, 'Has class Kvinner')
  t.end()
})

tap.test('returns overview of stages for race', async t => {
  t.equal(stages.length, 6)
  t.equal(stages[0], 1)
  t.equal(stages[stages.length - 1], 6)
  t.end()
})

tap.test('total winner in class is first in result array', (t) => {
  const men = r.Menn
  t.equal(men[0].final_rank, 1, 'total rank 1 is first')
  t.equal(men[0].stage1_time, '07:30.7', 'stage times are per stage')
  t.equal(men[0].stage1_rank, 1, 'stage rank is included')
  t.equal(men[0].stage2_rank, 3, 'stage rank is included')
  t.equal(men[0].acc_time_behind, '00:00.0', 'total time behind is included')

  t.equal(men[1].acc_time_behind, '01:51.4', 'total time behind is included')
  t.end()
})

tap.test('For stages either DNF or DNS, stage_time is replaced', (t) => {
  const men = r.Menn
  t.equal(men[68].stage6_time, 'DNF', 'stage time of zero is DNF')
  t.equal(men[74].stage6_time, 'DNS', 'stage time of zero is DNS if status is DNS')
  t.end()
})

tap.test('For classes with fewer stages, total is calculated for last', (t) => {
  const sport = r3.Sport
  t.equal(sport[0].acc_time, '27:44.0', 'total time is included for fewer stages')
  t.equal(sport[0].acc_time_behind, '00:00.0', 'total time is included for fewer stages')
  t.equal(sport[1].acc_time, '30:27.0', 'total time is included for fewer stages')
  t.equal(sport[1].acc_time_behind, '02:43.0', 'total time is included for fewer stages')
  t.end()
})

tap.test('Calculate percent_behind_leader in stage', (t) => {
  const sport = r3.Sport
  t.equal(sport[0].stage1_percent_behind_leader, '0', 'percent behind for winner is 0')
  t.equal(sport[1].stage1_percent_behind_leader, '7.5', 'percent behind for winner is 2.4')
  t.end()
})

tap.test('has data object for graph, per class', (t) => {
  t.equal(graphs['Menn-places'].length, 5, '5 first riders compared')
  t.equal(graphs['Menn-places'][0].name, 'Aslak Mørstad', 'Name is rider name')
  t.equal(graphs['Menn-places'][0].data.length, 6, 'one per stage in data')
  t.equal(graphs['Menn-places'][0].data[0][0], 1, 'one per stage in data')
  t.equal(graphs['Menn-places'][0].data[0][1], 1, 'one per stage in data')
  t.end()
})

tap.test('has data object for graph, per class', (t) => {
  t.equal(graphs['Menn-acc-times'].length, 5, '5 first riders compared')
  t.equal(graphs['Menn-acc-times'][1].data.length, 6, 'one per stage')
  t.equal(graphs['Menn-acc-times'][1].data[0][1].toFixed(1), '35.4', 'acc time behind in first is equal to behind in first')
  t.equal(graphs['Menn-acc-times'][1].data[1][1], 40.5, 'acc time behind in second is equal to behind in first + second')
  t.end()
})

tap.test('each row has details attached', (t) => {
  t.end()
})

tap.test('each row has graph object', (t) => {
  const men = r.Menn
  const winner = JSON.parse(men[0].chartData)
  const second = JSON.parse(men[1].chartData)
  const parsed3 = JSON.parse(men[men.length - 1].chartData)
  t.equal(winner.length, 5, '5 series in chartData')

  t.equal(winner[0].data[0][1], 0, 'winner is first')
  t.equal(winner[0].data[1][1], 0, 'winner is first')

  t.equal(second.length, 5, '5 series in chartData')
  t.equal(second[0].data[0][1], -35.4)
  t.equal(second[0].data[1][1], -5.1)
  t.equal(parsed3.length, 5, '5 series in chartData')
  t.end()
})

tap.test('each row has acc_times_behind array', (t) => {
  const men = r.Menn
  t.equal(men[0].acc_behind_leader.length, 6, 'on value per stage, all 0 for winner')
  t.equal(men[0].acc_behind_leader[0], '0.0', 'on value per stage, all 0 for winner')

  t.equal(men[1].acc_behind_leader[0], '35.4', 'acc behind for first stage is same as behind in stage')
  t.equal(men[3].acc_behind_leader[0], '33.2', 'acc behind for first stage is same as behind in stage')
  t.equal(men[3].acc_behind_leader[1], '95.5', 'acc behind for first stage is same as behind in stage')
  t.end()
})

tap.test('each row has time_behind_infront array', (t) => {
  const men = r.Menn
  t.equal(men[0].acc_behind_infront.length, 6, 'one value per stage, all 0 for winner')
  t.equal(men[0].acc_behind_infront[0], '0.0', 'one value per stage, all 0 for winner')

  t.equal(men[4].acc_behind_infront[0], '8.6', 'acc behind for first stage is same as behind in stage')
  t.equal(men[4].acc_behind_infront[1], '-13.6', 'acc behind for first stage is same as behind in stage')
  t.equal(men[4].acc_behind_infront[2], '32.8', 'acc behind for first stage is same as behind in stage')
  t.end()
})

tap.test('each row has place_by_stage array', (t) => {
  const men = r.Menn
  const places = men[2].place_by_stage
  t.equal(places.length, 6, 'one value per stage')
  t.equal(places[0], 4, 'fourth after first stage')
  t.equal(places[1], 2, 'second after second stage')
  t.equal(places[2], 4, '4th after third stage')
  // console.log(men[2])
  t.end()
})

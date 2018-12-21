const tap = require('tap')
const EqConverter = require('../import/converters/eq.js')
const path = require('path')

tap.test('parse complete result file', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/oslo-2013.csv'), {
    acc: false,
    mode: 'complete',
    datafile: path.join(__dirname, 'data/racedata.json')
  })
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'Oslo enduro', 'race name matches')
  t.equals(data.race.year, 2013, 'race year matches')
  t.equals(data.race.uid, '0220cbd5bc43a80de8e69070c3f2872c', 'race uid matches')
  t.equals(data.stages.length, 5, 'stages matches stage number')
  // t.equals(data.race.stages, 5, 'stages in number too')
})

tap.test('all racedata fields are included', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/oslo-2013.csv'), {
    acc: false,
    mode: 'complete',
    datafile: path.join(__dirname, 'data/racedata.json')
  })
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.series, 'test', 'series name is parsed')
  t.equals(data.race.links.length, 2, 'links are parsed')
})

tap.test('Object details for stages, non-accumulative mode', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/oslo-2013.csv'), {
    acc: false,
    mode: 'complete',
    datafile: path.join(__dirname, 'data/racedata.json')
  })

  const loaded = await eq.load()
  const data = await loaded.parse()
  const stage1 = data.stages[0]

  t.equals(stage1.name, 'SS1', 'stage name matches')
  t.equals(stage1.number, 1, 'stage number matches')
  t.equals(stage1.results.length, 68, 'stage result length matches')
  const rider = stage1.results[0]
  // console.log(stage1.results[0])

  t.equals(rider.name, 'Stina Bondehagen', 'name is correct')
  t.equals(rider.rider_uid, '105fe7e9a0446b152bef347939aeba57', 'uid is correct')
  t.equals(rider.time, '2:40', 'time is correct')
  t.equals(rider.gender, 'F', 'Gender is correct')
  t.equals(rider.class, 'Kvinner senior', 'class is correct')
  t.equals(rider.club, 'Oslo', 'club is correct')
  t.equals(rider.stage_time_ms, 160000, 'time in ms is correct')
  t.equals(rider.behind_leader_ms, 0, 'time behind leader in stage is correct')
  t.equals(rider.stage_rank, 1, 'rank is correct')

  t.equals(stage1.results[1].behind_leader_ms, 1000, 'time behind leader in stage is correct')
})

tap.test('Object details for stages, accumulative mode', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/complete-acc-race.csv'), {
    acc: true,
    mode: 'complete',
    datafile: path.join(__dirname, 'data/complete-acc-racedata.json')
  })

  const loaded = await eq.load()
  const data = await loaded.parse()
  const stage1 = data.stages[0]

  t.equals(stage1.name, 'FP 1 - Kongens Gruve', 'stage name matches')
  t.equals(stage1.number, 1, 'stage number matches')
  t.equals(stage1.results.length, 100, 'stage result length matches')
  const rider = stage1.results[0]

  t.equals(rider.name, 'Anita Løvli', 'name is correct')
  t.equals(rider.rider_uid, 'e2c668db34a035fcf81263563b8033e3', 'uid is correct')
  t.equals(rider.time, '12:37.2', 'time is correct')
  t.equals(rider.gender, 'F', 'Gender is correct')
  t.equals(rider.class, 'Kvinner senior', 'class is correct')
  t.equals(rider.club, 'Kongsberg', 'club is correct')
  t.equals(rider.acc_time_ms, 757200, 'time in ms is correct')
  t.equals(rider.behind_leader_ms, 0, 'time behind leader in stage is correct')
  t.equals(rider.stage_rank, null, 'stage_rank is null')
  t.equals(rider.rank, 1, 'rank is 1')

  t.equals(stage1.results[1].behind_leader_ms, 156800, 'time behind leader in stage is correct')
})

const tap = require('tap')
const Mylaps = require('../import/converters/mylaps.js')
const path = require('path')

tap.test('parse complete result file', async t => {
  const ml = new Mylaps(path.join(__dirname, 'data/drammen-2017.csv'), {
    datafile: path.join(__dirname, 'data/racedata-drammen2017.json')
  })

  const loaded = await ml.load()
  const data = await loaded.parse()
  t.equals(data.race.name, 'Drammenduro', 'race name matches')
  t.equals(data.race.year, 2017, 'race year matches')
  t.equals(data.race.date, '2017-07-01', 'race date matches')
  t.equals(data.race.uid, '9c5dc4c9a0ef9b18dc61f514ae9d1eab', 'race uid matches')
})

tap.test('Object details for stages', async t => {
  const ml = new Mylaps(path.join(__dirname, 'data/drammen-2017.csv'), {
    datafile: path.join(__dirname, 'data/racedata-drammen2017.json')
  })

  const loaded = await ml.load()
  const data = await loaded.parse()

  t.equals(data.stages.length, 5, 'correct number of stages')
  const stage1 = data.stages[0]
  const stage2 = data.stages[1]

  t.equals(stage1.name, 'FE1', 'stage name matches')
  t.equals(stage1.number, 1, 'stage number matches')
  t.equals(stage2.name, 'FE2', 'stage name matches')
  t.equals(stage2.number, 2, 'stage number matches')
  t.equals(stage1.results.length, 152, 'stage result length matches')
  const rider = stage1.results[0]

  t.equals(rider.name, 'Alice Grindheim', 'name is correct')
  t.equals(rider.bib, '5', 'bib is correct')
  t.equals(rider.rider_uid, '3a4e5a2c99e22aaf931e06ac5d9320e7', 'uid is correct')
  t.equals(rider.time, '0:06:14', 'time is correct')
  t.equals(rider.gender, 'F', 'Gender is correct')
  t.equals(rider.class, 'Kvinner senior', 'class is correct')
  t.equals(rider.club, '', 'club is correct')
  t.equals(rider.stage_time_ms, 374000, 'time in ms is correct')
  t.equals(rider.acc_time_ms, null, 'acc_time_ms is null')
  t.equals(rider.stage_rank, 1, 'rank is correct')
  t.equals(rider.status, 'OK', 'status is correct')

  t.equals(stage1.results[1].stage_rank, 4)

  t.equals(stage1.results[20].time, '00:00:00')
  t.equals(stage1.results[20].stage_rank, 21)
  t.equals(stage1.results[20].stage_time_ms, 0)
  t.equals(stage1.results[20].status, 'DNS')
})

tap.test('final status field is correct', async t => {
  const ml = new Mylaps(path.join(__dirname, 'data/drammen-2017.csv'), {
    datafile: path.join(__dirname, 'data/racedata-drammen2017.json')
  })

  const loaded = await ml.load()
  const data = await loaded.parse()

  const lastStage = data.stages[4]
  t.equals(lastStage.results[0].final_status, 'OK', 'winner has OK final_status')
  t.equals(lastStage.results[lastStage.results.length - 1].final_status, 'DNS', 'DNS rider has final_status DNS')
  t.equals(lastStage.results[lastStage.results.length - 17].final_status, 'DNF', 'DSQ rider has final_status DSQ')
  t.equals(lastStage.results[21].final_status, 'DSQ', 'DSQ rider has final_status DSQ')
  t.equals(lastStage.results[21].status, 'DSQ', 'DSQ rider has final_status DSQ')
  t.end()
})

tap.test('support for NOOP stages', async t => {
  const ml = new Mylaps(path.join(__dirname, 'data/hemsedal-2018.csv'), {
    datafile: path.join(__dirname, 'data/hemsedal-2018-racedata.json')
  })

  const loaded = await ml.load()
  const data = await loaded.parse()
  t.equals(data.race.name, 'Hardbarka enduro', 'race name matches')

  const persons = data.stages[4].results.filter((r) => {
    return r.name === 'Risto Holm'
  })
  t.equals(persons.length, 0, 'person should not have a stage 4, as class only has three stages')
})

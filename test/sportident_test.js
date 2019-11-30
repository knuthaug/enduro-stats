const tap = require('tap')
const Sportident = require('../import/converters/sportident.js')
const path = require('path')

tap.test('parse complete result file', async t => {
  const ml = new Sportident(path.join(__dirname, 'data/sportident.csv'), {
    datafile: path.join(__dirname, 'data/sportident-racedata.json')
  })

  const loaded = await ml.load()
  const data = await loaded.parse()
  t.equals(data.race.name, 'Hakadal enduro snowhill', 'race name matches')
  t.equals(data.race.year, 2019, 'race year matches')
  t.equals(data.race.date, '2019-03-02', 'race date matches')
  t.equals(data.race.uid, 'fc51d6c0a4bb7ff71ba81a05c12f632a', 'race uid matches')
})

tap.test('Object details for stages', async t => {
  const ml = new Sportident(path.join(__dirname, 'data/sportident.csv'), {
    datafile: path.join(__dirname, 'data/sportident-racedata.json')
  })

  const loaded = await ml.load()
  const data = await loaded.parse()

  t.equals(data.stages.length, 4, 'correct number of stages')
  const stage1 = data.stages[0]
  const stage2 = data.stages[1]

  t.equals(stage1.name, 'FE 1', 'stage name matches')
  t.equals(stage1.number, 1, 'stage number matches')
  t.equals(stage2.name, 'FE 2', 'stage name matches')
  t.equals(stage2.number, 2, 'stage number matches')
  t.equals(stage1.results.length, 41, 'stage result length matches')
  const rider = stage1.results[0]

  t.equals(rider.name, 'Anna Littorin-Sandbu', 'name is correct')
  t.equals(rider.bib, '30', 'bib is correct')
  t.equals(rider.rider_uid, '4e568767810427927204e9f66da1171d', 'uid is correct')
  t.equals(rider.time, '00:01:14', 'time is correct')
  t.equals(rider.gender, 'F', 'Gender is correct')
  t.equals(rider.class, 'Kvinner senior', 'class is correct')
  t.equals(rider.club, 'Lillehammer Ck', 'club is correct')
  t.equals(rider.stage_time_ms, 74000, 'time in ms is correct')
  t.equals(rider.acc_time_ms, null, 'acc_time_ms is null')
  t.equals(rider.stage_rank, 2, 'rank is correct')
  t.equals(rider.status, 'OK', 'status is correct')

  t.equals(stage1.results[1].stage_rank, 1)

  t.equals(stage1.results[2].time, '00:01:37')
  t.equals(stage1.results[2].rider_uid, '9b790c8a348ca445ef11f1828f9fe125', 'uid is correct')
  t.equals(stage1.results[2].stage_rank, 3)
  t.equals(stage1.results[2].stage_time_ms, 97000)
  t.equals(stage1.results[2].status, 'OK')
})

tap.test('final status field is correct', async t => {
  const ml = new Sportident(path.join(__dirname, 'data/sportident.csv'), {
    datafile: path.join(__dirname, 'data/sportident-racedata.json')
  })

  const loaded = await ml.load()
  const data = await loaded.parse()

  const lastStage = data.stages[3]
  t.equals(lastStage.results[0].final_status, 'OK', 'winner has OK final_status')
  //  console.log(lastStage.results[lastStage.results.length - 17])
  t.end()
})

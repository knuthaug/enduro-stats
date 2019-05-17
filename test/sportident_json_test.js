const tap = require('tap')
const SportidentJson = require('../import/converters/sportident_json.js')
const path = require('path')

tap.test('parse complete result file', async t => {
  const ml = new SportidentJson(path.join(__dirname, 'data/hakadal.json'), {
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
  const ml = new SportidentJson(path.join(__dirname, 'data/hakadal.json'), {
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

  t.equals(rider.name, 'Even Olav Sandberg', 'name is correct')
  t.equals(rider.rider_uid, '5dc52ab98e430fb12db8d7a6682ebf79', 'uid is correct')
  t.equals(rider.time, '01:37.000', 'time is correct')
  t.equals(rider.gender, 'M', 'Gender is correct')
  t.equals(rider.class, 'M15-16', 'class is correct')
  t.equals(rider.club, 'Ck Nittedal', 'club is correct')
  t.equals(rider.stage_time_ms, 97000, 'time in ms is correct')
  t.equals(rider.acc_time_ms, null, 'acc_time_ms is null')
  t.equals(rider.stage_rank, 7, 'stage rank 7 is correct')
  t.equals(rider.status, 'OK', 'status is correct')

  t.equals(stage1.results[1].stage_rank, 23)

  t.equals(stage1.results[2].time, '01:01.000')
  t.equals(stage1.results[2].rider_uid, 'e5ffdd441b4e194d31b91dc6242d721b', 'uid is correct')
  t.equals(stage1.results[2].stage_rank, 4)
  t.equals(stage1.results[2].stage_time_ms, 61000)
  t.equals(stage1.results[2].status, 'OK')
})

tap.test('final status field is correct', async t => {
  const ml = new SportidentJson(path.join(__dirname, 'data/hakadal.json'), {
    datafile: path.join(__dirname, 'data/sportident-racedata.json')
  })

  const loaded = await ml.load()
  const data = await loaded.parse()

  const lastStage = data.stages[3]
  t.equals(lastStage.results[0].final_status, 'OK', 'winner has OK final_status')
  //  console.log(lastStage.results[lastStage.results.length - 17])
  t.end()
})

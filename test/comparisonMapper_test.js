const tap = require('tap')
const fs = require('fs')
const path = require('path')

const mapper = require('../server/comparisonMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/comparisonData.json')).toString())
const r = mapper(data)

tap.test('one row per race, ', async (t) => {
  t.equals(r.length, 11, '11 races in common')
  t.equals(r[0].uid, 'acff26f96c230cfbafe3294fe5f5da06')
  t.equals(r[0].name, 'Bodø enduro 2018')
  t.end()
})

tap.test('each race has all comparison riders', async t => {
  t.equals(r[0].riders.length, 2, '2 riders in comparison')
  t.equals(r[1].riders.length, 2, '2 riders in comparison')

  const rider1 = r[0].riders[0]
  const rider2 = r[0].riders[1]
  t.equals(rider1.name, 'Svenn Fjeldheim', 'name matches record')
  t.equals(rider1.rider_uid, '16aa245876cc35048a730591c11d7f65', 'uid matches record')
  t.equals(rider1.stages.length, 6, 'correct number of stages in race')

  t.equals(rider2.name, 'Espen Bergli-Johnsen', 'name matches record')
  t.equals(rider2.stages[0].stage_time_ms, 406000, 'stage time')
  t.equals(rider2.final_rank, 2, 'final rank outisde of stages')
  t.equals(rider2.final_status, 'OK', 'final status outisde of stages')
  t.end()
})

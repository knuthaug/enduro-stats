const tap = require('tap')
const EqConverter = require('../import/converters/eq.js')
const path = require('path')

tap.test('read the file if it exists', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/kongsberg-2012-kvinner-fe1.csv'))
  const file = await eq.load()

  t.isA(file, 'EqConverter')
  t.end()
})

tap.test('If file does not exist, throw error', async t => {
  const eq = new EqConverter('./data/foo.csv')

  try {
    await eq.load()
  } catch (error) {
    t.isA(error, 'Error')
  }

  t.end()
})

tap.test('parse file with one stage in it', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/kongsberg-2012-kvinner-fe1.csv'), { mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'Kongsberg Sykkelenduro', 'race name matches')
  t.equals(data.race.date, '2012-09-29', 'date matches')
  t.equals(data.stages.length, 1, 'number of stages matches stage number')

  t.equals(data.stages[0].name, 'FP 1 - Kongens Gruve', 'stage name matches')
  t.equals(data.stages[0].number, '1', 'stage number matches')

  const r = data.stages[0].results

  t.equals(r[0].name, 'Anita Løvli', 'name matches source')
  t.equals(r[0].gender, 'F', 'gender is converted')
  t.equals(r[0].time, '12:37.2', 'time in minutes:seconds matches')
  t.equals(r[0].acc_time_ms, 757200, 'acc_time_ms for first stage is same as stage')
  t.equals(r[0].rank, 1, 'rank is converted')
  t.equals(r[0].status, 'OK', 'status is OK')
  t.equals(r[0].class, 'Kvinner senior', 'class matches')
  t.equals(r[0].club, '', 'club is included')
  t.equals(r[0].team, '', 'team is included')

  t.end()
})

tap.test('parse file and format', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/kongsberg-2012-menn-fe2.csv'), { mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'Kongsberg Sykkelenduro')
  t.equals(data.race.date, '2012-09-29')
  t.equals(data.race.year, '2012')
  t.equals(data.stages[0].number, '2', 'stage number from file')

  t.equals(data.stages[0].name, 'FP 2 - Sachsen')
  t.equals(data.stages[0].number, '2')

  const r = data.stages[0].results

  t.equals(r[0].name, 'Aslak Mørstad')
  t.equals(r[0].gender, 'M')
  t.equals(r[0].time, '12:52.0')
  t.equals(r[0].acc_time_ms, 772020)
  t.equals(r[0].rank, 1)
  t.equals(r[0].class, 'Menn senior')
  t.equals(r[0].club, '')
  t.equals(r[0].team, '')
  t.equals(r[r.length - 1].status, 'DNS')
  t.end()
})

tap.test('parse file and format, multiday', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2015-menn-fe1.csv'), { mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, '80/20 NesbyEnduro', 'name is matched')
  t.equals(data.race.date, '2015-05-23', 'date for race is first date')
  t.equals(data.race.year, '2015', 'year of race is included')
  t.equals(data.stages.length, 1, 'number of stages is included')

  t.end()
})

tap.test('parse file and format, other year', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2013-menn-fe3.csv'), { mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'NesbyEnduro', 'race name matches')
  t.equals(data.race.date, '2013-06-16', 'race date matches')

  t.equals(data.stages[0].name, 'SS3', 'stage name matches')
  t.equals(data.stages[0].number, '3', 'stage number matches')

  const r = data.stages[0].results

  t.equals(r[0].name, 'Espen Bergli-Johnsen', 'name matches')
  t.equals(r[0].gender, 'M', 'gender matches')
  t.equals(r[0].time, '12:47.8', 'time matches')
  t.equals(r[0].rank, 1, 'rank matches')
  t.equals(r[0].class, 'Menn senior', 'class matches')
  t.equals(r[0].club, '', 'club i included')
  t.equals(r[0].team, '', 'team is included')
  t.equals(r[r.length - 1].status, 'OK', 'status is ok when finished')
  t.end()
})

tap.test('race has uid, md5 of name and year', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2013-menn-fe3.csv'), { mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.uid, '4504e3dd07d15dec4044e6b2e32df739', 'md5 matches')
  t.end()
})

tap.test('rider has uid, md5 of name', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2013-menn-fe3.csv'), { mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()
  const r = data.stages[0].results

  t.equals(r[0].rider_uid, 'e3fdd33aa6dc207cb5c2b2ec7308bff1', 'md5 matches')
  t.end()
})

tap.test('test class name transcribing', t => {
  const eq = new EqConverter()
  t.equals(eq.className('1 Menn'), 'Menn senior')
  t.equals(eq.className('4 Kvinner'), 'Kvinner senior')
  t.equals(eq.className('M junior'), 'Menn junior')
  t.equals(eq.className('K junior'), 'Kvinner junior')
  t.equals(eq.className('k junior'), 'Kvinner junior')
  t.equals(eq.className('m jr'), 'Menn junior')
  t.equals(eq.className('3 Lag rekrutt'), 'Lag rekrutt')
  t.equals(eq.className('3Lag rekrutt'), 'Lag rekrutt')
  t.equals(eq.className('Lag'), 'Lag')
  t.end()
})

tap.test('handle eq files not in accumulative mode', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2014-menn-fe1.csv'), { acc: false, mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'NesbyEnduro 80twenty')
  t.equals(data.race.date, '2014-08-03')
  t.equals(data.race.year, '2014')
  t.equals(data.stages.length, 1, 'number of stages is one')

  t.equals(data.stages[0].name, 'SS1')
  t.equals(data.stages[0].number, '1')

  const r = data.stages[0].results

  t.equals(r[0].name, 'Ove Grøndal')
  t.equals(r[0].gender, 'M')
  t.equals(r[0].time, '07:46.0')
  t.equals(r[0].stage_time_ms, 466068)
  t.equals(r[0].rank, 1)
  t.equals(r[0].class, 'Menn senior')
  t.equals(r[0].club, '')
  t.equals(r[0].team, '')

  t.equals(r[1].rank, 2)
  t.equals(r[1].stage_time_ms, 477981)

  t.end()
})

tap.test('include club', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/traktor-2015-menn-fe1.csv'), { acc: false, mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()
  const r = data.stages[0].results

  t.equals(r[0].name, 'Espen Bergli-Johnsen', 'Name if first is Espen Johnsen')
  t.equals(r[0].gender, 'M', 'Gender is M')
  t.equals(r[0].rank, 1, 'rank is first')
  t.equals(r[0].stage_time_ms, 397000, 'time should be correct in ms')
  t.equals(r[0].class, 'Menn senior', 'class is menn senior')
  t.equals(r[0].club, 'Bergen MTB Klubb', 'club is correct')
  t.equals(r[0].team, '', 'team is empty')
  t.end()
})

tap.test('handle results with time in different named column', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2015-menn-fe1.csv'), { acc: false, mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()

  const r = data.stages[0].results
  t.equals(r[0].name, 'Zakarias Blom Johansen')
  t.equals(r[0].gender, 'M')
  t.equals(r[0].rank, 1)
  t.equals(r[0].stage_time_ms, 695000, 'time should be correct in ms')
  t.equals(r[0].time, '11:35.0', 'time should be correct in ms')
  t.equals(r[0].class, 'Menn senior')
  t.equals(r[0].club, 'SK Rye sykkel')
  t.equals(r[0].team, '')
  t.end()
})

tap.test('handle jr men from 2014 nesbyen (funky data)', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2014-menn-jr-fe1.csv'), { acc: false, mode: 'normal' })
  const loaded = await eq.load()
  const data = await loaded.parse()
  const r = data.stages[0].results

  t.equals(r[0].name, 'Ted Johansen')
  t.equals(r[0].gender, 'M')
  t.equals(r[0].rank, 1)
  t.equals(r[0].stage_time_ms, 547300, 'time should be correct in ms')
  t.equals(r[0].time, '09:07.3', 'time should be correct in ms')
  t.equals(r[0].class, 'Menn junior')
  t.equals(r[0].club, 'IF Frøy')
  t.equals(r[0].team, '')
  t.end()
})

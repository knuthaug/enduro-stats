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
  } catch(error) {
    t.isA(error, 'Error')
  }

  t.end()
})

tap.test('parse file', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/kongsberg-2012-kvinner-fe1.csv'))
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'Kongsberg Sykkelenduro 2012', 'race name matches')
  t.equals(data.race.date, '2012-09-29', 'date matches')
  t.equals(data.race.stages, '1', 'number of stages matches stage number')

  t.equals(data.stage.name, 'FP 1 - Kongens Gruve', 'stage name matches')
  t.equals(data.stage.number, '1', 'stage number matches')

  t.equals(data.results[0].name, 'Anita Løvli', 'name matches source')
  t.equals(data.results[0].gender, 'F', 'gender is converted')
  t.equals(data.results[0].time, '12:37.2', 'time in minutes:seconds matches')
  t.equals(data.results[0].timems, '757200', 'time in ms inś inclued')
  t.equals(data.results[0].rank, 1, 'rank is converted')
  t.equals(data.results[0].class, 'Kvinner', 'class matches')
  t.equals(data.results[0].club, '', 'club is included')
  t.equals(data.results[0].team, '', 'team is included')

  t.end()
})

tap.test('parse file and format', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/kongsberg-2012-menn-fe2.csv'))
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'Kongsberg Sykkelenduro 2012')
  t.equals(data.race.date, '2012-09-29')
  t.equals(data.race.year, '2012')
  t.equals(data.race.stages, '2')

  t.equals(data.stage.name, 'FP 2 - Sachsen')
  t.equals(data.stage.number, '2')

  t.equals(data.results[0].name, 'Aslak Mørstad')
  t.equals(data.results[0].gender, 'M')
  t.equals(data.results[0].time, '12:52.0')
  t.equals(data.results[0].rank, 1)
  t.equals(data.results[0].class, 'Menn')
  t.equals(data.results[0].club, '')
  t.equals(data.results[0].team, '')
  t.equals(data.results[data.results.length - 1].status, 'DNS')
  t.end()
})


tap.test('parse file and format, multiday', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2015-menn-fe1.csv'))
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, '80/20 NesbyEnduro', 'name is matched')
  t.equals(data.race.date, '2015-05-23', 'date for race is first date')
  t.equals(data.race.year, '2015', 'year of race is included')
  t.equals(data.race.stages, '1', 'number of stages is included')

  t.end()
})
tap.test('parse file and format , other year', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2013-menn-fe3.csv'))
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'NesbyEnduro', 'race name matches')
  t.equals(data.race.date, '2013-06-16', 'race date matches')

  t.equals(data.stage.name, 'SS3', 'stage name matches')
  t.equals(data.stage.number, '3', 'stage number matches')

  t.equals(data.results[0].name, 'Espen Johnsen', 'name matches')
  t.equals(data.results[0].gender, 'M', 'gender matches')
  t.equals(data.results[0].time, '12:47.8', 'time matches')
  t.equals(data.results[0].rank, 1, 'rank matches')
  t.equals(data.results[0].class, 'Menn', 'class matches')
  t.equals(data.results[0].club, '', 'club i included')
  t.equals(data.results[0].team, '', 'team is included')
  t.equals(data.results[data.results.length - 1].status, 'TIME', 'status is time when finished')
  t.end()
})

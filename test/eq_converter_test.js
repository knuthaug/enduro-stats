const tap = require('tap')
const EqConverter = require('../converters/eq.js')
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

  t.equals(data.race.name, 'Kongsberg Sykkelenduro 2012')
  t.equals(data.race.date, '2012-09-29')

  t.equals(data.stage.name, 'FP 1 - Kongens Gruve')
  t.equals(data.stage.number, '1')

  t.equals(data.results[0].name, 'Anita Løvli')
  t.equals(data.results[0].gender, 'F')
  t.equals(data.results[0].time, '12:37.2')
  t.equals(data.results[0].rank, 1)
  t.equals(data.results[0].class, 'Kvinner')
  t.equals(data.results[0].club, '')
  t.equals(data.results[0].team, '')

  t.end()
})

tap.test('parse file and format', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/kongsberg-2012-menn-fe2.csv'))
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'Kongsberg Sykkelenduro 2012')
  t.equals(data.race.date, '2012-09-29')

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

tap.test('parse file and format , other year', async t => {
  const eq = new EqConverter(path.join(__dirname, 'data/nesbyen-2013-menn-fe3.csv'))
  const loaded = await eq.load()
  const data = await loaded.parse()

  t.equals(data.race.name, 'NesbyEnduro')
  t.equals(data.race.date, '2013-06-16')

  t.equals(data.stage.name, 'SS3')
  t.equals(data.stage.number, '3')

  t.equals(data.results[0].name, 'Espen Johnsen')
  t.equals(data.results[0].gender, 'M')
  t.equals(data.results[0].time, '12:47.8')
  t.equals(data.results[0].rank, 1)
  t.equals(data.results[0].class, 'Menn')
  t.equals(data.results[0].club, '')
  t.equals(data.results[0].team, '')
  t.equals(data.results[data.results.length - 1].status, 'TIME')
  t.end()
})

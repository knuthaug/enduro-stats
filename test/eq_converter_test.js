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

  t.equals(data.results[0].name, 'Anita Løvli')
  t.equals(data.results[0].gender, 'F')
  t.equals(data.results[0].netTime, '12:37.2')
  t.equals(data.results[0].rank, 1)
  t.equals(data.results[0].class, '4 Kvinner')
  console.log(data)
  t.end()
})

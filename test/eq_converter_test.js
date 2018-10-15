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

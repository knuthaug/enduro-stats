const tap = require('tap')

const sp = require('../import/spellcheck.js')

tap.test('names are replaced', (t) => {
  t.equals(sp.check('Edgars C?rulis'), 'Edgars Cirulis', 'special name is replaced')
  t.equals(sp.check('Greg Shaw'), 'Greg Saw', 'special name is replaced')
  t.equals(sp.check('Tom Haukom'), 'Tom Ole Haukom', 'special name is replaced')
  t.end()
})

tap.test('Names are capitalized', (t) => {
  t.equals(sp.check('test name'), 'Test Name', 'capitalized for non utf-8')
  t.equals(sp.check('test-foo name'), 'Test-Foo Name', 'capitalized for non utf-8 with hyphens')
  t.equals(sp.check('test-foo NAME'), 'Test-Foo Name', 'capitalized for non utf-8 with hyphens')
  t.end()
})

tap.test('Names are cleaned', (t) => {
  t.equals(sp.check('|test |name'), 'Test Name', 'cleanup of bars')
  t.end()
})

tap.test('utf-8 names are supported', (t) => {
  t.equals(sp.check('øivind åsen'), 'Øivind Åsen', 'norwegian chars uppercased')
  t.equals(sp.check('öivind äsen'), 'Öivind Äsen', 'swedish chars uppercased')
  t.end()
})


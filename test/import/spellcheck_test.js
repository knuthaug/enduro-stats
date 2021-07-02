const tap = require('tap')
const sp = require('../../import/spellcheck.js')

tap.test('names are replaced', (t) => {
  t.equal(sp.check('Edgars C?rulis'), 'Edgars Cirulis', 'special name is replaced')
  t.equal(sp.check('Greg Shaw'), 'Greg Saw', 'special name is replaced')
  t.equal(sp.check('Tom Haukom'), 'Tom Ole Haukom', 'special name is replaced')
  t.end()
})

tap.test('Names are capitalized', (t) => {
  t.equal(sp.check('test name'), 'Test Name', 'capitalized for non utf-8')
  t.equal(sp.check('test-foo name'), 'Test-Foo Name', 'capitalized for non utf-8 with hyphens')
  t.equal(sp.check('test-foo NAME'), 'Test-Foo Name', 'capitalized for non utf-8 with hyphens')
  t.end()
})

tap.test('Names are cleaned', (t) => {
  t.equal(sp.check('|test |name'), 'Test Name', 'cleanup of bars')
  t.end()
})

tap.test('utf-8 names are supported', (t) => {
  t.equal(sp.check('øivind åsen'), 'Øivind Åsen', 'norwegian chars uppercased')
  t.equal(sp.check('öivind äsen'), 'Öivind Äsen', 'swedish chars uppercased')
  t.end()
})

tap.test('multiple spaces are truncated', (t) => {
  t.equal(sp.check('øivind  åsen'), 'Øivind Åsen', 'Multiple spaces to one')
  t.equal(sp.check('  öivind  äsen '), 'Öivind Äsen', 'multiple spaces to one, leading and trailing is trimmed')
  t.end()
})

tap.test('Club names are substituted', (t) => {
  t.equal(sp.checkClub('BMK'), 'Bergen MTB klubb', 'case-insensitive replace')
  t.end()
})

tap.test('Add point after single letter intials', async t => {
  t.equal(sp.check('Anders S Bråten'), 'Anders S. Bråten')
  t.end()
})

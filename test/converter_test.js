const tap = require('tap')
const Converter = require('../import/converters/converter.js')

tap.test('K17x classname converts to Kvinner senior', async t => {
  const conv = new Converter()
  t.equals(conv.className('K17+'), 'Kvinner senior', 'class name is converted')
  t.end()
})

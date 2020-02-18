const tap = require('tap')
const fs = require('fs')
const path = require('path')
const deepFreeze = require('deep-freeze')

const mapper = require('../../server/seriesResultMapper.js')
const data = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/racesForSeries.json')).toString()))

const r = mapper(data)

tap.test('maps to classes', (t) => {
  t.equals(r.length, 7, 'all classes in toplevel')
  t.end()
})



const tap = require('tap')
const fs = require('fs')
const path = require('path')

const mapper = require('../server/comparisonGraphMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/comparisonGraphData.json')).toString())
const r = mapper(data)

tap.test('Maps to series format, ', async (t) => {
  t.equals(r.length, 2, 'two riders for race')
  t.equals(r[0].name, 'Svenn Fjeldheim', 'series name is name of rider')
  t.end()
})


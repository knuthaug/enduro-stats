const tap = require('tap')
const fs = require('fs')
const path = require('path')

const mapper = require('../server/comparisonGraphMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/comparisonGraphData.json')).toString())
const r = mapper(data)

tap.test('Maps to series format, ', async (t) => {
  t.equals(r.length, 2, 'two riders for race')
  t.equals(r[0].name, 'Espen Bergli-Johnsen', 'series name is name of rider')
  t.equals(r[1].name, 'Svenn Fjeldheim', 'series name is name of rider')

  t.equals(r[0].data.length, 6, 'data array is number of stages')
  t.deepEquals(r[0].data[0], [1, 6], 'data array is number of stages')
  console.log(r[0])
  t.end()
})


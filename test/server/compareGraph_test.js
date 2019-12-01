const tap = require('tap')
const fs = require('fs')
const path = require('path')
const deepFreeze = require('deep-freeze')

const mapper = require('../../server/comparisonGraphMapper.js')
const data = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/comparisonGraphData.json')).toString()))

tap.test('Maps to places format, ', async (t) => {
  const r = mapper.places(data)
  t.equals(r.length, 2, 'two riders for race')
  t.equals(r[0].name, 'Espen Bergli-Johnsen', 'series name is name of rider')
  t.equals(r[1].name, 'Svenn Fjeldheim', 'series name is name of rider')

  t.equals(r[0].data.length, 6, 'data array is number of stages')
  t.deepEquals(r[0].data[0], [1, 6], 'data array is number of stages')
  t.end()
})

tap.test('Maps to time behind format, ', async (t) => {
  const r = mapper.timeBehind(data)
  t.equals(r.length, 2, 'two riders for race')
  t.equals(r[0].name, 'Espen Bergli-Johnsen', 'series name is name of rider')
  t.equals(r[1].name, 'Svenn Fjeldheim', 'series name is name of rider')

  t.equals(r[0].data.length, 6, 'data array is number of stages')
  t.deepEquals(r[0].data[0], [1, 0], 'data array is number of stages')
  t.deepEquals(r[0].data[1], [2, 22], 'data array is number of stages')
  t.end()
})

tap.test('Maps to acc time behind format, ', async (t) => {
  const r = mapper.accTimeBehind(data)
  t.equals(r.length, 2, 'two riders for race')
  t.equals(r[0].name, 'Espen Bergli-Johnsen', 'series name is name of rider')
  t.equals(r[1].name, 'Svenn Fjeldheim', 'series name is name of rider')

  t.equals(r[0].data.length, 6, 'data array is number of stages')
  t.deepEquals(r[0].data[0], [1, 0], 'data array is number of stages')
  t.deepEquals(r[0].data[1], [2, 0], 'data array is number of stages')
  t.end()
})

const tap = require('tap')
const fs = require('fs')
const path = require('path')
const deepFreeze = require('deep-freeze')

const mapper = require('../../server/raceViewMapper.js')
const data = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/races.json')).toString()))

const r = mapper(data)

tap.test('maps to years', (t) => {
  t.equals(r[0].year, 2016, 'Has list per year')
  t.equals(r[0].races.length, 4, 'Has list with races for year')
  t.end()
})

tap.test('maps to years cont', (t) => {
  t.equals(r[1].races.length, 4, 'Has list per year')
  t.equals(r[1].races[0].name, '80/20 NesbyEnduro', 'Has list with names per year')
  t.end()
})

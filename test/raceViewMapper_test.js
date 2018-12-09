const tap = require('tap')
const fs = require('fs')
const path = require('path')

const mapper = require('../server/raceViewMapper.js')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/races.json')).toString())

const r = mapper(data)

tap.test('maps to years', (t) => {
  t.equals(r.hasOwnProperty('2012'), true, 'has year 2012')
  t.equals(r['2012'].length, 1, 'Has list per year')
  t.equals(r['2012'][0].name, 'Kongsberg Sykkelenduro', 'Has list with names per year')
  t.end()
})

tap.test('maps to years cont', (t) => {
  t.equals(r.hasOwnProperty('2015'), true, 'has year 2012')
  t.equals(r['2015'].length, 4, 'Has list per year')
  t.equals(r['2015'][0].name, '80/20 OsloEnduro', 'Has list with names per year')
  t.end()
})


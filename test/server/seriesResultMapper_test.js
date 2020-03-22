const tap = require('tap')
const fs = require('fs')
const path = require('path')
const deepFreeze = require('deep-freeze')

const mapper = require('../../server/seriesResultMapper.js')
const data = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/racesForSeries.json')).toString()))
const riderData = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/series_for_rider.json')).toString()))

const r = mapper.mapToSeries(data)
const rRider = mapper.mapToSeriesForRider(riderData)

tap.test('maps to classes', (t) => {
  t.equals(r.length, 10, 'all classes in toplevel')
  t.equals(r[0].name, 'Kvinner master', 'classes have names')
  t.end()
})

tap.test('sorts by overall placements', (t) => {
  t.equals(r[0].entries.length, 12, 'all riders in a class')
  t.equals(r[0].entries[0].name, 'Marte Lund', 'entries have names')
  t.equals(r[0].entries[0].uid, '82cf4f5e7c6f14635da21560a8ba44d8', 'entries have uid')
  t.equals(r[0].entries[0].avgRank, 0.8333333333333334, 'entries have avg. rank')
  t.equals(r[0].entries[0].totalPoints, 2000, 'entries have total points')
  t.equals(r[0].entries[0].maxTotalPoints, 2500, 'entries have maxtotal points')
  t.equals(r[0].entries[0].races.length, 6, 'all races in row, also not participated')
  t.deepEquals(r[0].entries[0].races, [
    { name: 'Telemark enduro', rank: 1 , totalInClass: 4, points: 500},
    { name: 'Traktorland enduro', rank: 1, totalInClass: 4, points: 500 },
    { name: 'DrammEnduro', rank: 0, points: 0 },
    { name: 'Oslo enduro', rank: 1, totalInClass: 5, points: 500 },
    { name: 'Hakadal enduro', rank: 1, totalInClass: 4, points: 500},
    { name: 'Ringerike enduro', rank: 1, totalInClass: 8, points: 500 },
  ], 'all races in row, also not participated')

  t.equals(r[0].entries[1].avgRank, 1.5, 'entries have avg. rank')
  t.equals(r[0].entries[1].totalPoints, 1880, 'entries have total points')
  t.equals(r[0].entries[1].maxTotalPoints, 2340, 'entries have maxtotal points')
  t.end() 
})

tap.test('has all races as list on toplevel', (t) => {
  t.equals(r[0].allRaces.length, 6, 'all races')
  t.deepEquals(r[0].allRaces, [
    'Telemark enduro',
    'Traktorland enduro',
    'DrammEnduro',
    'Oslo enduro',
    'Hakadal enduro',
    'Ringerike enduro'
  ],
  'all races are sorted')
  t.end() 
})


tap.test('maps to years', (t) => {
  t.equals(rRider.length, 2, '2 series')
  t.equals(rRider[0].years[0].year, 2015, 'year in ascending order')
  t.equals(rRider[1].years[0].year, 2018, 'year in ascending order')

  t.equals(rRider[0].years.length, 5, 'one year for series ')
  t.equals(rRider[0].years[0].races[0].raceName, '80/20 Luster enduro', '')
  t.equals(rRider[1].years[1].races[0].raceName, 'Hakadal enduro', 'Østafjells second')

  // t.equals(rRider[0].series[0].results.length, 5, 'all races in series for year')
  // t.equals(rRider[0].series[0].results[0].raceUid, '17251312d0557cd78a88ee4636b5c77d', 'all races in series for year')

  t.end()
})


const tap = require('tap')
const fs = require('fs')
const path = require('path')
const deepFreeze = require('deep-freeze')

const mapper = require('../../server/seriesResultMapper.js')
const data = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/racesForSeries.json')).toString()))
const riderData = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/series_for_rider.json')).toString()))
const riderDataNc = deepFreeze(JSON.parse(fs.readFileSync(path.join(__dirname, '../data/series_for_rider_nc.json')).toString()))

const r = mapper.mapToSeries(data, 'Østafjells enduroserie')
const rNc = mapper.mapToSeries(data, 'NC')
const rRider = mapper.mapToSeriesForRider(riderData)
const rRiderNc = mapper.mapToSeriesForRider(riderDataNc)

tap.test('maps to classes', (t) => {
  t.equal(r.length, 10, 'all classes in toplevel')
  t.equal(r[0].name, 'Kvinner master', 'classes have names')
  t.end()
})

tap.test('sorts by overall placements', (t) => {
  t.equal(r[0].entries.length, 12, 'all riders in a class')
  t.equal(r[0].entries[0].name, 'Marte Lund', 'entries have names')
  t.equal(r[0].entries[0].uid, '82cf4f5e7c6f14635da21560a8ba44d8', 'entries have uid')
  t.equal(r[0].entries[0].avgRank, 0.8333333333333334, 'entries have avg. rank')
  t.equal(r[0].entries[0].totalPoints, 2000, 'entries have total points')
  t.equal(r[0].entries[0].maxTotalPoints, 2500, 'entries have maxtotal points')
  t.equal(r[0].entries[0].races.length, 6, 'all races in row, also not participated')
  t.same(r[0].entries[0].races, [
    { name: 'Telemark enduro', rank: 1 , totalInClass: 4, points: 500},
    { name: 'Traktorland enduro', rank: 1, totalInClass: 4, points: 500 },
    { name: 'DrammEnduro', rank: 0, points: 0 },
    { name: 'Oslo enduro', rank: 1, totalInClass: 5, points: 500 },
    { name: 'Hakadal enduro', rank: 1, totalInClass: 4, points: 500},
    { name: 'Ringerike enduro', rank: 1, totalInClass: 8, points: 500 },
  ], 'all races in row, also not participated')

  t.equal(r[0].entries[1].avgRank, 1.5, 'entries have avg. rank')
  t.equal(r[0].entries[1].totalPoints, 1880, 'entries have total points')
  t.equal(r[0].entries[1].maxTotalPoints, 2340, 'entries have maxtotal points')
  t.end() 
})

tap.test('sorts by overall placements NC', (t) => {
  t.equal(rNc[0].entries.length, 12, 'all riders in a class')
  t.equal(rNc[0].entries[0].name, 'Marte Lund', 'entries have names')
  t.equal(rNc[0].entries[0].uid, '82cf4f5e7c6f14635da21560a8ba44d8', 'entries have uid')
  t.equal(rNc[0].entries[0].avgRank, 0.8333333333333334, 'entries have avg. rank')
  t.equal(rNc[0].entries[0].totalPoints, 2400, 'entries have total points')
  t.equal(rNc[0].entries[0].maxTotalPoints, 3000, 'entries have maxtotal points')
  t.equal(rNc[0].entries[0].races.length, 6, 'all races in row, also not participated')
  t.same(rNc[0].entries[1].races, [
    { name: 'Telemark enduro', rank: 2 , totalInClass: 4, points: 480},
    { name: 'Traktorland enduro', rank: 2, totalInClass: 4, points: 480 },
    { name: 'DrammEnduro', rank: 1, points: 600, totalInClass: 3 },
    { name: 'Oslo enduro', rank: 0, points: 0 },
    { name: 'Hakadal enduro', rank: 2, totalInClass: 4, points: 480},
    { name: 'Ringerike enduro', rank: 2, totalInClass: 8, points: 480 },
  ], 'all races in row, also not participated')

  t.equal(rNc[0].entries[1].avgRank, 1.5, 'entries have avg. rank')
  t.equal(rNc[0].entries[1].totalPoints, 2040, 'entries have total points')
  t.equal(rNc[0].entries[1].maxTotalPoints, 2520, 'entries have maxtotal points')
  t.end() 
})

tap.test('has all races as list on toplevel', (t) => {
  t.equal(r[0].allRaces.length, 6, 'all races')
  t.same(r[0].allRaces, [
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
  t.equal(rRider.length, 2, '2 series')
  t.equal(rRider[0].years[0].year, 2015, 'year in ascending order')
  t.equal(rRider[1].years[0].year, 2018, 'year in ascending order')

  t.equal(rRider[0].years.length, 5, 'one year for series ')
  t.equal(rRider[0].years[0].races[0].raceName, '80/20 Luster enduro', '')
  t.equal(rRider[1].years[1].races[0].raceName, 'Hakadal enduro', 'Østafjells second')

  // t.equal(rRider[0].series[0].results.length, 5, 'all races in series for year')
  // t.equal(rRider[0].series[0].results[0].raceUid, '17251312d0557cd78a88ee4636b5c77d', 'all races in series for year')

  t.end()
})

tap.test('maps to years for NC', (t) => {
  t.equal(rRider.length, 2, '2 series')
  t.equal(rRider[0].years[0].year, 2015, 'year in ascending order')
  t.equal(rRider[1].years[0].year, 2018, 'year in ascending order')

  t.equal(rRider[0].years.length, 5, 'one year for series ')
  t.equal(rRider[0].years[0].races[0].raceName, '80/20 Luster enduro', '')
  t.equal(rRider[1].years[1].races[0].raceName, 'Hakadal enduro', 'Østafjells second')

  // t.equal(rRider[0].series[0].results.length, 5, 'all races in series for year')
  // t.equal(rRider[0].series[0].results[0].raceUid, '17251312d0557cd78a88ee4636b5c77d', 'all races in series for year')

  t.end()
})

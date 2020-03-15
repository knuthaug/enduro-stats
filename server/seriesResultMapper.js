const compareAsc = require('date-fns/compare_asc')
const parse = require('date-fns/parse')

function mapToSeriesForRider(data) {
  const results = []

  data.forEach(row => {
    if(!results.find(r => r.year === row.race_year)) {
      results.push({year: row.race_year, series: []})
    }
  })

  results.forEach(r => {

    ['80/20 enduro series', 'Østafjells enduroserie'].forEach(seriesName => {
      const results = data.filter(row => row.race_year === r.year)
            .filter(row => row.series === seriesName)
            .map(row => {
              return { raceName: row.race_name, raceUid: row.race_uid, rank: row.final_rank}
            })

      if(results.length > 0) {
        r.series.push({
          seriesName,
          results
        })
      }
    })
  })

  return results.filter(r => {
    return r.series[0].results.length !== 0 || r.series[1].results.length !== 0
  })
}

function mapToSeries(data) {
  const classes = [...new Set(data.map(r => r.class))]
  const raceNames = data
        .slice()
        .sort((a, b) => compareAsc(parse(a.race_date), parse(b.race_date)))
        .map(r => r.race_name)

  const races = [... new Set(raceNames)]

  const mapping = classes.map(c => {
    return { name: c, entries: [], allRaces: races }
  })

  classes.forEach(className => {
    const resultsForClass = data.filter(cls => cls.class === className)
    const riderRows = []
    resultsForClass.forEach(result => {
      const found = riderRows.findIndex(r => r.name === result.name)

      if(found !== -1) {
        riderRows[found].races.push({
          name: result.race_name,
          rank: result.final_rank,
          totalInClass: totalInClass(resultsForClass, result.race_name),
          points: pointsForClass(className, result.final_rank)
        })
      } else {
        riderRows.push({ name: result.name, uid: result.uid, races: [
          {
            name: result.race_name,
            rank: result.final_rank,
            totalInClass: totalInClass(resultsForClass, result.race_name),
            points: pointsForClass(className, result.final_rank)
          }
        ]})
      }
    })


    //fill missing races
    for(let i = 0 ; i < riderRows.length; i++) {
      if(riderRows[i].races.length < raceNames.length) {

        races.forEach((race, index) => {
          const foundRace = riderRows[i].races.findIndex(r => r.name === race)
          if(foundRace === -1) {
            riderRows[i].races.splice(index, 0, { name: race, rank: 0, points: 0 })
          }
        })
      }
    }

    //avg rank
    const foundClass = mapping.findIndex(m => m.name === className)
    mapping[foundClass].entries = riderRows.map(r => {
      r.avgRank = r.races.reduce(function (sum, value) {
        return sum + value.rank;
      }, 0) / r.races.length

      let pointsRaces = r.races.slice(0)

      while(pointsRaces.length > 4) {
        pointsRaces.splice(indexOfSmallest(pointsRaces), 1)
      }

      r.totalPoints = pointsRaces.reduce(function (sum, value) {
        return sum + value.points;
      }, 0)

      r.maxTotalPoints = r.races.reduce(function (sum, value) {
        return sum + value.points;
      }, 0)



      return r
    }).sort((a, b) => {
      return b.totalPoints - a.totalPoints
    })

  })

  return mapping
}

function totalInClass(results, name) {
  return results.filter(r => r.race_name === name).length
}

function indexOfSmallest(array) {
  var lowest = 0;
  for (var i = 1; i < array.length; i++) {
    if (array[i].points < array[lowest].points) {
      lowest = i
    }
  }
  return lowest
}


function pointsForClass(cls, place) {
  if('Menn senior'.match(cls)) {
    return pointsMen[place]
  }

  return pointsOther[place]
}

const pointsMen = []

let point = 510
for(let i = 1; i < 300; i++) {
  if(point === 20) {
    pointsMen[i] = point
  } else {
    pointsMen[i] = point -= 10
  }
}


const pointsOther = []

point = 540
for(let i = 1; i < 300; i++) {
  if(point === 20) {
    pointsOther[i] = point
  } else {
    pointsOther[i] = point -= 40
  }
}

Array.max = function(array){
  return Math.max.apply(Math, array);
}

Array.min = function(array){
  return Math.min.apply(Math, array);
}

module.exports = {
  mapToSeries,
  mapToSeriesForRider
}

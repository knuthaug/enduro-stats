const compareAsc = require("date-fns/compare_asc");
const parse = require("date-fns/parse");

function mapToSeriesForRider(data) {
  const results = [];

  data.forEach((row) => {
    if (!results.find((r) => r.series === row.series)) {
      results.push({ series: row.series, years: [] });
    }
  });

  const allYears = [];
  data.forEach((row) => {
    if (!allYears.find((y) => y === row.race_year)) {
      allYears.push(row.race_year);
    }
  });

  allYears.forEach((year) => {
    data
      .filter((d) => d.race_year === year)
      .forEach((d) => {
        const resultIndex = results.findIndex((ri) => ri.series === d.series);
        if (results[resultIndex].years.length === 0) {
          results[resultIndex].years.push({
            year: d.race_year,
            races: [
              {
                raceName: d.race_name,
                raceUid: d.race_uid,
                rank: d.final_rank,
              },
            ],
          });
        } else {
          const yearIndex = results[resultIndex].years.findIndex(
            (y) => year === y.year
          );
          if (yearIndex === -1) {
            results[resultIndex].years.push({
              year: d.race_year,
              races: [
                {
                  raceName: d.race_name,
                  raceUid: d.race_uid,
                  rank: d.final_rank,
                },
              ],
            });
          } else {
            results[resultIndex].years[yearIndex].races.push({
              raceName: d.race_name,
              raceUid: d.race_uid,
              rank: d.final_rank,
            });
          }
        }
      });
  });

  return results;
}

function mapToSeries(data, seriesName) {
  //console.log(data);
  const classes = [...new Set(data.map((r) => r.class))];
  const raceNames = data
    .slice()
    .sort((a, b) => compareAsc(parse(a.race_date), parse(b.race_date)))
    .map((r) => {
      return { name: r.race_name, uid: r.race_uid };
    });

  const races = [...new Set(raceNames.map((r) => r.name))];
  const allRaceNames = [];
  for (const r of raceNames) {
    if (!allRaceNames.find((v) => v.uid === r.uid)) {
      allRaceNames.push(r);
    }
  }

  const mapping = classes.map((c) => {
    return { name: c, entries: [], allRaces: races, allRaceNames };
  });

  classes.forEach((className) => {
    const resultsForClass = data.filter((cls) => cls.class === className);
    const riderRows = [];
    resultsForClass.forEach((result) => {
      const found = riderRows.findIndex((r) => r.name === result.name);

      if (found !== -1) {
        riderRows[found].races.push({
          name: result.race_name,
          rank: result.final_rank,
          status: result.final_status,
          totalInClass: totalInClass(resultsForClass, result.race_name),
          points: pointsForClass(
            className,
            result.final_rank,
            result.final_status,
            seriesName
          ),
        });
      } else {
        riderRows.push({
          name: result.name,
          uid: result.uid,
          races: [
            {
              name: result.race_name,
              rank: result.final_rank,
              status: result.final_status,
              totalInClass: totalInClass(resultsForClass, result.race_name),
              points: pointsForClass(
                className,
                result.final_rank,
                result.final_status,
                seriesName
              ),
            },
          ],
        });
      }
    });

    //fill missing races
    for (let i = 0; i < riderRows.length; i++) {
      if (riderRows[i].races.length < raceNames.length) {
        races.forEach((race, index) => {
          const foundRace = riderRows[i].races.findIndex(
            (r) => r.name === race
          );
          if (foundRace === -1) {
            riderRows[i].races.splice(index, 0, {
              name: race,
              rank: 0,
              points: 0,
              status: "OK",
            });
          }
        });
      }
    }

    //avg rank
    const foundClass = mapping.findIndex((m) => m.name === className);
    mapping[foundClass].entries = riderRows
      .map((r) => {
        r.avgRank =
          r.races.reduce(function (sum, value) {
            return sum + value.rank;
          }, 0) / r.races.length;

        let pointsRaces = r.races.slice(0);

        if (seriesName !== "NC") {
          while (pointsRaces.length > 4) {
            pointsRaces.splice(indexOfSmallest(pointsRaces), 1);
          }
        }

        r.totalPoints = pointsRaces.reduce(function (sum, value) {
          return sum + value.points;
        }, 0);

        r.maxTotalPoints = r.races.reduce(function (sum, value) {
          return sum + value.points;
        }, 0);

        return r;
      })
      .sort((a, b) => {
        return b.totalPoints - a.totalPoints;
      });

    let currentRank = 1;
    for (let i = 0; i < mapping[foundClass].entries.length; i++) {
      //currentRank++
      if (i > 0) {
        if (
          mapping[foundClass].entries[i].totalPoints ===
          mapping[foundClass].entries[i - 1].totalPoints
        ) {
          // after the first one, check for identical points
          mapping[foundClass].entries[i].seriesrank =
            mapping[foundClass].entries[i - 1].seriesrank;
          currentRank++;
        } else {
          mapping[foundClass].entries[i].seriesrank = currentRank++;
        }
      } else {
        mapping[foundClass].entries[i].seriesrank = currentRank++;
      }
    }
  });

  return mapping;
}

function totalInClass(results, name) {
  return results.filter((r) => r.race_name === name).length;
}

function indexOfSmallest(array) {
  var lowest = 0;
  for (var i = 1; i < array.length; i++) {
    if (array[i].points < array[lowest].points) {
      lowest = i;
    }
  }
  return lowest;
}

function pointsForClass(cls, place, status, series) {
  if (status !== "OK") {
    return 0;
  }

  if (series && series === "NC") {
    return pointsNC[place];
  }

  if ("Menn senior".match(cls)) {
    return pointsMen[place];
  }

  return pointsOther[place];
}

const pointsMen = [];

let point = 510;
for (let i = 1; i < 300; i++) {
  if (point === 20) {
    pointsMen[i] = point;
  } else {
    pointsMen[i] = point -= 10;
  }
}

const pointsOther = [];

point = 540;
for (let i = 1; i < 300; i++) {
  if (point === 20) {
    pointsOther[i] = point;
  } else {
    pointsOther[i] = point -= 40;
  }
}

const pointsNC = [
  0, 600, 480, 420, 360, 330, 300, 270, 240, 210, 180, 162, 144, 132, 120, 108,
  96, 90, 84, 78, 72, 66, 60, 54, 48, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33,
  32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14,
  13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];

Array.max = function (array) {
  return Math.max.apply(Math, array);
};

Array.min = function (array) {
  return Math.min.apply(Math, array);
};

module.exports = {
  mapToSeries,
  mapToSeriesForRider,
};

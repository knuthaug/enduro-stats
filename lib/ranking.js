const Db = require('../server/db');
const ImportDb = require('../import/db');
const { convertTimeToMs } = require('../lib/time.js');
const { riderViewMapper } = require('../server/riderViewMapper');
const diffDays = require('date-fns/difference_in_days');
const parse = require('date-fns/parse');
const { percentRanks } = require('./percent_ranks.js');
const db = new Db();
const importDb = new ImportDb();

async function allRidersRankings(
  riders,
  currentYear,
  currentRaceId,
  currentRaceDate
) {
  riders.forEach(async (rider) => {
    const rawRaces = await db.raceResultsForRider(rider.uid);
    const races = riderViewMapper(rawRaces);
    const raceIds = races.map((r) => {
      return { race: r.race, class: r.class, date: r.date };
    });
    const ridersPerClass = await db.ridersForClassAndRace(raceIds);
    const results = percentRanks(races, ridersPerClass);
    const { year, avg, score } = await userRanking(
      results,
      currentRaceDate,
      rider
    );
    await importDb.addRankings(rider.id, year, avg, score, currentRaceDate);
  });
}

async function userRanking(rows, currentRaceDate, rider) {
  const years = {};
  const scores = [];

  for (let i = 0; i < rows.length; i++) {
    if (!years.hasOwnProperty(rows[i].year)) {
      years[rows[i].year] = [];
    }

    if (rows[i].time_behind !== 'DNS' && rows[i].time_behind !== 'DNF') {
      years[rows[i].year].push(rows[i].rank);

      // only last three years
      if (diffDays(parse(currentRaceDate), parse(rows[i].date)) <= 1095) {
        if (rows[i].rank !== 1 || rows[i].rank / rows[i].count < 1) {
          const rankAsPercent = (rows[i].rank / rows[i].count) * 10;

          if (
            rider.uid === '97f71ce4a6a3cc3ed342425a95cef161' ||
            rider.uid === 'c250595d8c9f7648510eaa02f226ef6e'
          ) {
            console.log(
              `Rider: ${rider.name}: race: ${rows[i].race} rankAsPercentScore:${rankAsPercent}
              } `
            );
          }

          scores.push(rankAsPercent);
        } else if (rows[i].rank === 1) {
          if (
            rider.uid === '97f71ce4a6a3cc3ed342425a95cef161' ||
            rider.uid === 'c250595d8c9f7648510eaa02f226ef6e'
          ) {
            console.log(`rider: ${rider.name}: winner (0 points)`);
          } // winner
          if (rows[i].count === 1) {
            // only one in class, add a point
            scores.push(1);
          } else {
            scores.push(0);
          }
        }
      }
    }
  }

  const avgs = {};
  Object.keys(years).forEach((y) => {
    const a =
      years[y].reduce((a, b) => {
        return a + b;
      }, 0) / years[y].length;
    avgs[y] = {};
    avgs[y].sum = years[y].length - a;
    avgs[y].avg = a;
  });

  let max = -1000;
  let year = 2000;
  const keys = Object.keys(avgs);
  for (let i = 0; i < keys.length; i++) {
    if (avgs[keys[i]].sum >= max) {
      max = avgs[keys[i]].sum;
      year = keys[i];
    }
  }

  if (year === 2000) {
    return { year: 0, avg: 0, score: 1000 };
  }

  // score is average percent behind winner in class
  let score =
    scores.reduce((acc, cur) => {
      return acc + cur;
    }, 0) / scores.length;

  if (
    rider.uid === '97f71ce4a6a3cc3ed342425a95cef161' ||
    rider.uid === 'c250595d8c9f7648510eaa02f226ef6e'
  ) {
    console.log(`rider: ${rider.name}: score ${score}`);
  }
  // add baseline 20 points
  score += 3.14;

  if (
    rider.uid === '97f71ce4a6a3cc3ed342425a95cef161' ||
    rider.uid === 'c250595d8c9f7648510eaa02f226ef6e'
  ) {
    console.log(`rider: ${rider.name}: score2 ${score}`);
  }
  // add 10 for each race below 5, so few races gives you slight penalty
  if (scores.length < 5) {
    score += (5 - scores.length) * 10;
  }

  if (
    rider.uid === '97f71ce4a6a3cc3ed342425a95cef161' ||
    rider.uid === 'c250595d8c9f7648510eaa02f226ef6e'
  ) {
    console.log(`rider: ${rider.name}: score3 ${score}`);
  }

  // only one race, add 100
  if (scores.length === 1) {
    score += 100;
  }

  if (
    rider.uid === '97f71ce4a6a3cc3ed342425a95cef161' ||
    rider.uid === 'c250595d8c9f7648510eaa02f226ef6e'
  ) {
    console.log(`rider: ${rider.name}: score4 ${score}`);
  }

  if (scores.length === 0) {
    score = 1000;
  }

  if (
    rider.uid === '97f71ce4a6a3cc3ed342425a95cef161' ||
    rider.uid === 'c250595d8c9f7648510eaa02f226ef6e'
  ) {
    console.log(`rider: ${rider.name}: score5 ${score}`);
  }

  return {
    year,
    avg: parseFloat(avgs[year].avg, 10).toFixed(1),
    score: score.toFixed(2),
  };
}

module.exports = {
  userRanking,
  allRidersRankings,
  percentRanks,
};

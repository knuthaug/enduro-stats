const Db = require("../server/db");
const ImportDb = require("../import/db");
const { convertTimeToMs } = require("../lib/time.js");
const { riderViewMapper } = require("../server/riderViewMapper");
const { parse, differenceInDays } = require("date-fns");
const { percentRanks } = require("./percent_ranks.js");
const db = new Db();
const importDb = new ImportDb();

async function allRidersRankings(
  riders,
  currentYear,
  currentRaceId,
  currentRaceDate,
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
      currentYear,
      currentRaceDate,
      rider,
    );
    await importDb.addRankings(rider.id, year, avg, score, currentRaceDate);
  });
}

async function userRanking(rows, currentYear, currentRaceDate, rider) {
  const years = {};
  const scores = [];

  for (let i = 0; i < rows.length; i++) {
    if (!years.hasOwnProperty(rows[i].year)) {
      years[rows[i].year] = [];
    }

    if (rows[i].time_behind !== "DNS" && rows[i].time_behind !== "DNF") {
      years[rows[i].year].push(rows[i].rank);

      if (
        differenceInDays(parse(currentRaceDate), parse(rows[i].date)) <= 1095
      ) {
        if (rows[i].rank !== 1 || rows[i].rank / rows[i].count < 1) {
          const totalTime = convertTimeToMs(rows[i].time);
          const winnerTime = await db.winnerTimeOfRace(
            rows[i].race,
            rows[i].gender,
            rows[i].uid,
          );
          const diffTime = totalTime - winnerTime;

          if (diffTime >= 0) {
            // filter out classes with fewer stages
            scores.push((diffTime / winnerTime) * 100);
          }
        } else if (rows[i].rank === 1) {
          // winner
          scores.push(0);
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

  // add baseline 20 points
  score += 3.14;

  // add 10 for each race below 5, so few races gives you slight penalty
  if (scores.length < 5) {
    score += (5 - scores.length) * 10;
  }

  // only one race, add 100
  if (scores.length === 1) {
    score += 100;
  }

  if (scores.length === 0) {
    score = 1000;
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

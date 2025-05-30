import md5 from "md5";
import Db from "./db.js";
import { EqConverter } from "./converters/eq.mjs";
import { Mylaps } from "./converters/mylaps.mjs";
import { Sportident } from "./converters/sportident.mjs";
import { SportidentJson } from "./converters/sportident_json.mjs";
import fs from "fs";
import * as afs from "node:fs/promises";
import path from "path";
import AccumulatedStageCalculations from "./accumulated_stage_calculations.js";
import NormalStageCalculations from "./normal_stage_calculations.js";
import logger from "./logger.js";
import cmd from "command-line-args";
import { allRidersRankings } from "../lib/ranking.cjs";

const db = new Db();
const accCalc = new AccumulatedStageCalculations();
const normalCalc = new NormalStageCalculations();

const optionDefinitions = [
  { name: "accumulate", alias: "a", type: Boolean },
  { name: "dir", alias: "d", type: String },
  { name: "mylaps", alias: "m", type: Boolean },
  { name: "sportident", alias: "s", type: Boolean },
  { name: "json", alias: "j", type: Boolean },
  { name: "file", alias: "f", type: String },
  { name: "racedata", alias: "r", type: String },
];

const options = cmd(optionDefinitions);

options.mode = "eq";

if (!options.hasOwnProperty("accumulate")) {
  options.accumulate = false;
}

if (options.hasOwnProperty("mylaps")) {
  options.mode = "mylaps";
}

if (options.hasOwnProperty("sportident")) {
  options.mode = "sportident";
}

if (options.hasOwnProperty("json")) {
  options.mode = "json";
}

if (
  !options.hasOwnProperty("dir") &&
  !options.hasOwnProperty("file") &&
  !options.hasOwnProperty("racedata")
) {
  console.log("Usage: [-a] -d path/to/directory || -f path/to/file");
  process.exit(-1);
}

const dir = options.dir;
if (dir) {
  fs.readdir(dir, async function (err, items) {
    let raceName, raceYear, raceId, raceDate;
    for (let i = 0; i < items.length; i++) {
      const { raceName, raceYear, raceId, raceDate } =
        await readSingleStageFile(items[i]);
    }

    const classes = await db.classesForRace(raceId);
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].class === "Lag Rekrutt") {
        continue;
      }

      logger.info(
        `Reading back results for race ${raceName}, year=${raceYear}, class=${classes[i].class}`,
      );
      const results = await db.rawRaceResults(
        raceName,
        raceYear,
        classes[i].class,
      );
      logger.debug(`got ${results.length} rows`);

      let calcs;
      if (options.accumulate) {
        calcs = await accCalc.differentials(results, options);
      } else {
        calcs = await normalCalc.differentials(results, options);
      }

      await db.insertCalculatedResults(raceId, calcs);
    }

    const allRiders = await db.findAllRiders().then((data) => {
      return data.filter((r) => {
        return r.count !== "0";
      });
    });

    await calculateRankings(allRiders, raceYear, raceId, raceDate);

    db.destroy();
  });
}

// single file results
if (options.file) {
  const dirNameParts = options.file.split(/\//);
  const dirName = dirNameParts.slice(0, dirNameParts.length - 1).join("/");
  calculateComplete(dirName);
}

if (options.racedata) {
  readRaceData(options.racedata);
}

async function readRaceData(file) {
  const stats = await afs.stat(file);

  if (stats.isFile()) {
    logger.info(`reading data file ${file} for extra data`);
    const datafile = await afs.readFile(file, "utf-8");
    const data = JSON.parse(datafile);
    data.uid = md5(data.name + data.year);

    const raceId = await db.insertRace(data, 0);

    if (data.hasOwnProperty("links")) {
      await db.insertRaceLinks(raceId, data.links);
    }

    if (data.hasOwnProperty("details")) {
      await db.insertStageDetails(raceId, data.details);
    }
  } else {
    logger.error(`Data file ${file} was not found`);
    console.log(`Data file ${file} was not found`);
    process.exit(1);
  }
}

async function calculateComplete(dirName) {
  const { raceName, raceYear, raceId, raceDate } = await readCompleteRaceFile(
    options.file,
    path.join(dirName, "racedata.json"),
    options.mode,
  );

  const classes = await db.classesForRace(raceId);
  for (let i = 0; i < classes.length; i++) {
    if (
      classes[i].class === "Lag Rekrutt" ||
      classes[i].class === "Boys 12-17"
    ) {
      continue;
    }

    logger.info(
      `Reading back results for race ${raceName}, year=${raceYear}, class=${classes[i].class}`,
    );
    const results = await db.rawRaceResults(
      raceName,
      raceYear,
      classes[i].class,
    );
    logger.debug(`got ${results.length} rows`);

    let calcs;
    if (options.accumulate) {
      calcs = await accCalc.differentials(results, options);
    } else {
      calcs = await normalCalc.differentials(results, options);
    }

    // console.log(calcs)
    await db.insertCalculatedResults(raceId, calcs);
  }

  const allRiders = await db.findAllRiders().then((data) => {
    return data.filter((r) => {
      return r.count !== "0";
    });
  });
  //await calculateRankings(allRiders, raceYear, raceId, raceDate);

  db.destroy();
}

async function calculateRankings(riders, year, raceId, raceDate) {
  await allRidersRankings(riders, year, raceId, raceDate);
}

async function readCompleteRaceFile(filename, datafile, mode) {
  let data = {};
  let parser;
  if (mode === "eq") {
    parser = new EqConverter(filename, {
      mode: "complete",
      datafile,
      acc: options.accumulate,
    });
  } else if (mode === "mylaps") {
    parser = new Mylaps(filename, { datafile });
  } else if (mode === "sportident") {
    parser = new Sportident(filename, { datafile });
  } else if (mode === "json") {
    parser = new SportidentJson(filename, { datafile });
  }

  await parser.load();
  data = await parser.parse();
  let raceId;

  for (let i = 0; i < data.stages.length; i++) {
    raceId = await db.insertRace(data.race, data.stages[i].number);
    await db.insertStage(data.race.name, data.stages[i], raceId);
    await db.insertRawResults(
      data.race.name,
      data.race.year,
      data.stages[i],
      data.stages[i].results,
    );
  }

  if (data.race.hasOwnProperty("links")) {
    db.insertRaceLinks(raceId, data.race.links);
  }

  if (data.race.hasOwnProperty("details")) {
    db.insertStageDetails(raceId, data.race.details);
  }

  return {
    raceName: data.race.name,
    raceYear: data.race.year,
    raceId: raceId,
    raceDate: data.race.date,
  };
}

async function readSingleStageFile(filename) {
  const fullName = path.join(dir, filename);
  const eq = new EqConverter(fullName, {
    mode: "normal",
    acc: options.accumulate,
  });
  await eq.load();
  const data = await eq.parse();
  const raceId = await db.insertRace(data.race, data.stages[0].number);
  await db.insertStage(data.race.name, data.stages[0], raceId);
  await db.insertRawResults(
    data.race.name,
    data.race.year,
    data.stages[0],
    data.stages[0].results,
  );
  return {
    raceName: data.race.name,
    raceYear: data.race.year,
    raceId: raceId,
    raceDate: data.race.date,
  };
}

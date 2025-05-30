/**
 * @fileOverview Sportiden race format parser. it requires the following fields/conventions
 to work properly:
 * stages are named FE$num and FE$num Pos, e.g. FE1, FE1 Pos, FE2, FE2 Pos etc
 * Club field 'club'
 * rider name in 'name'
 * rider gender in 'gender'
 * class in field 'Class'
 * time in field 'time', format hh:mm:ss
 * final position/status in 'Pos Klasse' field
 * @name mylaps.js
 * @author Knut Haugen
 * @license ISC
 */

import csv from "neat-csv";
import * as fs from "node:fs/promises";
import logger from "../logger.js";
import { DNS_STATUS } from "../constants.js";
import { check } from "../spellcheck.js";
import Converter from "./converter.js";
import lib from "./lib.js";
export class Sportident extends Converter {
  /**
   * A parser/converter for mylaps race results, with multiple stages on one line
   * @constructor
   * @param {string} filename - filename containing results
   * @param {string} options - options object. Only key 'datafile' is supported, full path to json file with extra race data not in the results file
   */
  constructor(filename, options) {
    super();
    this.filename = filename;
    this.options = options || {};

    if (this.options.hasOwnProperty("datafile")) {
      this.datafileName = options.datafile;
    }
  }

  /**
   * Load data files for this converter, stored in this
   */
  async load() {
    const stats = await fs.stat(this.filename);

    if (stats.isFile()) {
      logger.info(`reading file ${this.filename}`);
      this.file = await fs.readFile(this.filename, "utf-8");

      if (this.datafileName) {
        const stats = await fs.stat(this.datafileName);

        if (stats.isFile()) {
          logger.info(`reading data file ${this.datafileName} for extra data`);
          this.datafile = await fs.readFile(this.datafileName, "utf-8");
        } else {
          logger.error(`Data file ${this.datafileName} was not found`);
        }
      }
      return this;
    }

    logger.error(`File ${this.filename} was not found`);
    throw new Error(`file ${this.filename} does not exist`);
  }

  async parse() {
    let race = {};

    if (this.datafile) {
      try {
        race = JSON.parse(this.datafile);
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
    }

    race.uid = this.checksum(race.name + race.year);
    const stages = await this.parseStages();
    return { race, stages };
  }

  /**
   * parse stages and return array of results, flattened out ready for database storage.
   * @return { race, stages } - a race object and a list of stages, with results per stage
   */
  async parseStages() {
    const raw = await csv(this.file, { separator: ";" });
    const stages = this.findStages(raw);

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      stage.results = [];
      for (let j = 0; j < raw.length; j++) {
        const time = lib.convertTimeMs(
          raw[j][`${stage.name} Time`],
          raw[j][`${stage.name} Pos`],
        );
        if (!isNaN(time)) {
          stage.results.push({
            bib: raw[j].bib,
            time: raw[j][`${stage.name} Time`],
            name: check(`${raw[j]["First Name"]} ${raw[j].Surname}`),
            rider_uid: this.checksum(
              check(`${raw[j]["First Name"]} ${raw[j].Surname}`),
            ),
            gender: lib.findGender(this.className(raw[j].Category)),
            class: this.className(raw[j].Category),
            club: this.clubName(raw[j].Team || ""),
            stage_time_ms: time,
            final_status: lib.finalStatus(raw[j]["Pos Klasse"]),
            acc_time_ms: null,
            stage_rank: lib.stageRank(
              parseInt(raw[j][`${stage.name} Pos`], 10),
            ),
            status: this.setStatus(
              raw[j][`${stage.name} Pos`],
              raw[j][stage.name],
            ),
          });
        }
      }
    }

    // fix dns/dnf pos
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      let pos = 0;
      for (let j = 0; j < stage.results.length; j++) {
        if (
          Number.isNaN(stage.results[j].stage_rank) |
          Number.isNaN(stage.results[j].stage_rank)
        ) {
          stage.results[j].stage_rank = pos++ + 1;
        } else {
          pos = stage.results[j].stage_rank;
        }
      }
    }
    // console.log(JSON.stringify(stages.slice(0, 1), null, 2))
    return stages;
  }

  convertTime(time, pos) {
    if (lib.finished(pos)) {
      return time;
    }

    return "00:00:00";
  }

  setStatus(pos, time) {
    if (pos === 0 || pos === "0") {
      return DNS_STATUS;
    } else if (time === "00:00:00") {
      return DNS_STATUS;
    } else if (lib.notFinished(pos)) {
      return pos;
    } else if (lib.finished(pos)) {
      return "OK";
    }
    return pos;
  }

  findStages(rows) {
    const stages = [];
    let stageNum = 1;
    const row = rows[0];
    const keys = Object.keys(row);

    for (let i = 0; i < keys.length; i++) {
      const key = `FE ${stageNum} Time`;

      if (
        row.hasOwnProperty(key) &&
        !stages.find((e) => {
          return e.name === key;
        })
      ) {
        stages.push({ name: `FE ${stageNum}`, number: stageNum });
        stageNum++;
      }
    }
    return stages;
  }
}

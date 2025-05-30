/**
 * @fileOverview eq-timing race format parser. It can handle both multiple files per stage and
 * newer style one file for the complete race.
 * @name mylaps.js
 * @author Knut Haugen
 * @license ISC
 */

import csv from "neat-csv";
import * as fs from "node:fs/promises";
import logger from "../logger.js";
import { check } from "../spellcheck.js";
import { convertMsToTime, convertTimeToMs } from "../../lib/time.js";
import Converter from "./converter.js";

export class EqConverter extends Converter {
  /**
   * A parser/converter for eq timing race results, with one result per line
   * @constructor
   * @param {string} filename - filename containing results
   * @param {string} options - options object.
   * keys:
   * 'mode': normal or complete. Normal means file containing one stage, complete has all stages in one file. Default normal
   * 'acc': true/false. True means stage times are accumulated through race, false means stage times are just stage times. default true
   * 'datafile': optional full path to datafile containing race data. Needed for complete mode files as they don't have race name and date in them.
   */
  constructor(filename, options) {
    super();
    this.filename = filename;
    this.options = options || {};

    if (!this.options.hasOwnProperty("mode")) {
      this.options.mode = "normal";
    }

    if (!this.options.hasOwnProperty("acc")) {
      this.options.acc = true;
    }

    if (this.options.hasOwnProperty("datafile")) {
      this.datafileName = options.datafile;
    }

    this.parsers = {
      normal: this.parseNormal,
      complete: this.parseComplete,
    };
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

  /**
   * parse stages and return array of results, flattened out ready for database storage.
   * @return { race, stages } - a race object and a list of stages, with results per stage
   */
  async parse() {
    if (this.parsers.hasOwnProperty(this.options.mode)) {
      return this.parsers[this.options.mode].call(this);
    } else {
      console.log(`Unknown parser ${this.options.mode} specified`);
      return {};
    }
  }

  async parseComplete() {
    let race = {};
    if (this.datafile) {
      race = JSON.parse(this.datafile);
    }

    race.uid = this.checksum(race.name + race.year);
    const stages = await this.parseStages();
    return {
      race,
      stages,
    };
  }

  async parseStages() {
    const raw = await csv(this.file, { separator: ";" });
    // console.log(raw)
    const stages = [];
    let stageNum = 1;
    const stageList = [...new Set(raw.map((r) => r.Race))];

    for (let i = 0; i < stageList.length; i++) {
      const stageResults = raw.filter((r) => {
        return r.Race === stageList[i];
      });

      stages.push({
        name: stageList[i],
        number: stageNum++,
        results: stageResults.map((r) => {
          return {
            bib: r.Startnumber,
            rider_uid: this.checksum(check(`${r.Firstname} ${r.Surname}`)),
            name: check(`${r.Firstname} ${r.Surname}`),
            gender: r.Gender,
            class: this.className(r.Class),
            club: this.clubName(r.Club),
            time: r["Total Time"],
            stage_rank: this.options.acc ? null : parseInt(r.Rank, 10),
            rank: this.options.acc ? parseInt(r.Rank, 10) : null,
            stage_time_ms: this.options.acc
              ? null
              : convertTimeToMs(r["Total Time"]),
            acc_time_ms: this.options.acc
              ? convertTimeToMs(r["Total Time"])
              : null,
            behind_leader_ms: convertTimeToMs(r["Diff Winner"]),
            status: this.convertStatusComplete(r),
          };
        }),
      });
    }
    return stages;
  }

  async parseNormal() {
    const raw = await csv(this.file);
    return {
      race: {
        name: this.raceName(raw[0]),
        uid: this.raceChecksum(raw[0]),
        date: raw[0].Starttime.split(/T/)[0],
        year: this.year(raw[0]),
      },
      stages: [
        {
          name: raw[0][' "RaceName"'].trim(),
          number: raw[0][' "RaceName"'].match(/(\d+)/)[1],
          results: raw.map((row) => {
            const name = check(row.NameFormatted);
            const ret = {
              rider_uid: this.checksum(name),
              name,
              gender: row.Gender,
              time: convertMsToTime(row.NetTime),
              rank: parseInt(row.RankClass, 10),
              class: this.className(row.ClassName),
              club: row.Club,
              team: row.Team,
              status: this.convertStatus(row.Status),
            };

            return this.setTime(ret, parseInt(row.NetTime, 10));
          }),
        },
      ],
    };
  }

  setTime(obj, time) {
    if (this.options.acc) {
      // accumulative mode, stage times are this stage plus the one before.
      if (obj.status !== "OK") {
        obj.acc_time_ms = 0;
      } else {
        obj.acc_time_ms = time;
      }
    } else {
      // stage time is just that
      if (obj.status !== "OK") {
        obj.stage_time_ms = 0;
      } else {
        obj.stage_time_ms = time;
      }
    }

    return obj;
  }

  raceName(obj) {
    const year = this.year(obj);
    return obj.EventName.replace(year, "").trim();
  }

  year(obj) {
    if (obj.hasOwnProperty("Starttime")) {
      return obj.Starttime.split(/T/)[0].split(/-/)[0];
    }

    return obj.TimeOfDay.split(/T/)[0].split(/-/)[0];
  }

  convertStatus(status) {
    if (status === "TIME") {
      return "OK";
    }
    return status;
  }

  convertStatusComplete(row) {
    if (row.Status) {
      return row.Status;
    }

    if (convertTimeToMs(row["Total Time"]) === 0) {
      return "DNS";
    }
    return "OK";
  }
}

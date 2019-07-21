/**
 * @fileOverview Sportiden json race format parser. it requires the following fields/conventions
 to work properly:
 * @name sportident_json.js
 * @author Knut Haugen
 * @license ISC
 */

const fs = require('await-fs')
const logger = require('../logger.js')
const { DNS_STATUS, OK_STATUS } = require('../constants.js')
const { check, checkClub } = require('../spellcheck.js')
const Converter = require('./converter.js')
const lib = require('./lib.js')
class SportidentJson extends Converter {
  /**
   * A parser/converter for mylaps race results, with multiple stages on one line
   * @constructor
   * @param {string} filename - filename containing results
   * @param {string} options - options object. Only key 'datafile' is supported, full path to json file with extra race data not in the results file
   */
  constructor (filename, options) {
    super()
    this.filename = filename
    this.options = options || { }

    if (this.options.hasOwnProperty('datafile')) {
      this.datafileName = options.datafile
    }
  }

  /**
   * Load data files for this converter, stored in this
   */
  async load () {
    const stats = await fs.stat(this.filename)

    if (stats.isFile()) {
      logger.info(`reading file ${this.filename}`)
      this.file = await fs.readFile(this.filename, 'utf-8')

      if (this.datafileName) {
        const stats = await fs.stat(this.datafileName)

        if (stats.isFile()) {
          logger.info(`reading data file ${this.datafileName} for extra data`)
          this.datafile = await fs.readFile(this.datafileName, 'utf-8')
        } else {
          logger.error(`Data file ${this.datafileName} was not found`)
        }
      }
      return this
    }

    logger.error(`File ${this.filename} was not found`)
    throw new Error(`file ${this.filename} does not exist`)
  }

  async parse () {
    let race = {}

    if (this.datafile) {
      try {
        race = JSON.parse(this.datafile)
      } catch (err) {
        console.log(err)
        process.exit(1)
      }
    }

    race.uid = this.checksum(race.name + race.year)
    const stages = await this.parseStages()
    return { race, stages }
  }

  /**
   * parse stages and return array of results, flattened out ready for database storage.
   * @return { race, stages } - a race object and a list of stages, with results per stage
   */
  async parseStages () {
    let raw
    try {
      raw = JSON.parse(this.file)
    } catch (error) {
      logger.error(error)
      process.exit(1)
    }
    const stages = this.findStages(raw)

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i]
      stage.results = []
      for (let j = 0; j < raw.results.length; j++) {
        const rider = raw.results[j].athlete
        const stageResults = raw.results[j].stages
        if (stageResults !== null) {
          const status = this.setStatus(stageResults[i].result.position.class,
            this.parseTime(stageResults[i].result.time))
          stage.results.push({
            name: check(`${rider.firstname} ${rider.lastname}`),
            rider_uid: this.checksum(check(`${rider.firstname} ${rider.lastname}`)),
            class: this.className(rider.class),
            club: checkClub(rider.club),
            time: this.parseTime(stageResults[i].result.time),
            stage_time_ms: lib.convertTimeMs(this.parseTime(stageResults[i].result.time)),
            acc_time_ms: null,
            stage_rank: stageResults[i].result.position.class,
            status,
            final_status: lib.finalStatus(status),
            gender: lib.findGender(rider.class)
          })
        }
      }
    }
    return stages
  }

  findGender (clazz) {
    if (/kvinner/i.test(clazz) || /^k/i.test(clazz)) {
      return 'F'
    }
    return 'M'
  }

  parseTime (time) {
    return time.split(':').slice(2).join(':')
  }

  convertTime (time, pos) {
    if (lib.finished(pos)) {
      return time
    }

    return '00:00:00'
  }

  setStatus (pos, time) {
    if (pos === 0 || pos === '0') {
      return DNS_STATUS
    } else if (time === '00:00.000') {
      return DNS_STATUS
    } else if (lib.notFinished(pos)) {
      return pos
    }
    return OK_STATUS
  }

  findStages (raw) {
    let number = 1
    const entry = raw.results[0]
    return entry.stages.map((e) => {
      return {
        name: e.name,
        number: number++
      }
    })
  }
}

module.exports = SportidentJson

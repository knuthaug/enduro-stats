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

const csv = require('neat-csv')
const fs = require('await-fs')
const logger = require('../logger.js')
const { ERROR_RANK, DNS_STATUS, DNF_STATUS, OK_STATUS } = require('../constants.js')
const { check } = require('../spellcheck.js')
const { convertTimeToMs } = require('../../lib/time.js')
const Converter = require('./converter.js')

class Sportident extends Converter {
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
    const raw = await csv(this.file, { separator: ';' })
    const stages = this.findStages(raw)

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i]
      stage.results = []
      for (let j = 0; j < raw.length; j++) {
        const time = this.convertTimeMs(raw[j][`${stage.name} Time`], raw[j][`${stage.name} Pos`])
        if (!isNaN(time)) {
          stage.results.push({
            time: raw[j][`${stage.name} Time`],
            name: check(`${raw[j]['First Name']} ${raw[j].Surname}`),
            rider_uid: this.checksum(check(`raw[j]['First Name'] raw[j].Surname`)),
            gender: this.findGender(this.className(raw[j].Category)),
            class: this.className(raw[j].Category),
            club: this.clubName(raw[j].Team || ''),
            stage_time_ms: time,
            final_status: this.finalStatus(raw[j]['Pos Klasse']),
            acc_time_ms: null,
            stage_rank: this.stageRank(parseInt(raw[j][`${stage.name} Pos`], 10)),
            status: this.setStatus(raw[j][`${stage.name} Pos`], raw[j][stage.name])
          })
        }
      }
    }

    // fix dns/dnf pos
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i]
      let pos = 0
      for (let j = 0; j < stage.results.length; j++) {
        if (Number.isNaN(stage.results[j].stage_rank) | Number.isNaN(stage.results[j].stage_rank)) {
          stage.results[j].stage_rank = pos++ + 1
        } else {
          pos = stage.results[j].stage_rank
        }
      }
    }
    //console.log(JSON.stringify(stages, null, 2))
    return stages
  }

  findGender(clazz) {
    if(/kvinner/i.test(clazz) || /^k/i.test(clazz)) {
      return 'F'
    }
    return 'M'
  }

  finalStatus (value) {
    if (value === DNS_STATUS || value === DNF_STATUS) {
      return value
    }

    return OK_STATUS
  }

  stageRank (rank) {
    if (rank === 0 || rank === DNS_STATUS || rank === DNF_STATUS) {
      return ERROR_RANK
    }

    return rank
  }

  convertTimeMs (time, pos) {
    if (this.finished(pos)) {
      return convertTimeToMs(time)
    } else if (pos === 0 || pos === '0') {
      return 0
    }

    return 0
  }

  convertTime (time, pos) {
    if (this.finished(pos)) {
      return time
    }

    return '00:00:00'
  }

  finished (pos) {
    return pos !== DNS_STATUS && pos !== DNF_STATUS
  }

  notFinished (pos) {
    return pos === DNS_STATUS || pos === DNF_STATUS
  }

  setStatus (pos, time) {
    if (pos === 0 || pos === '0') {
      return DNS_STATUS
    } else if (time === '00:00:00') {
      return DNS_STATUS
    } else if (this.notFinished(pos)) {
      return pos
    } else if (this.finished(pos)) {
      return 'OK'
    }
    return pos
  }

  findStages (rows) {
    const stages = []
    let stageNum = 1
    const row = rows[0]
    const keys = Object.keys(row)

    for (let i = 0; i < keys.length; i++) {
      const key = `FE ${stageNum} Time`

      if (row.hasOwnProperty(key) && !stages.find((e) => { return e.name === key })) {
        stages.push({ name: `FE ${stageNum}`, number: stageNum})
        stageNum++
      }
    }
    return stages
  }
}

module.exports = Sportident

const csv = require('neat-csv')
const fs = require('await-fs')
const logger = require('../logger.js')
const { check, normalizeCase } = require('../spellcheck.js')
const { convertMsToTime, convertTimeToMs } = require('../../lib/time.js')
const Converter = require('./converter.js')

class Mylaps extends Converter {

  constructor (filename, options) {
    super()
    this.filename = filename
    this.options = options || { }

    if (this.options.hasOwnProperty('datafile')) {
      this.datafileName = options.datafile
    }
  }

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
      race = JSON.parse(this.datafile)
    }

    race.uid = this.checksum(race.name + race.year)
    const stages = await this.parseStages()
    return { race, stages }
  }

  async parseStages() {
    const raw = await csv(this.file, { separator: ';' })
    //console.log(raw)

    const stages = this.findStages(raw)

    for(let i = 0; i < stages.length; i++) {
      const stage = stages[i]
      stage.results = []
      for(let j = 0; j < raw.length; j++) {
        stage.results.push({
          time: this.convertTime(raw[j][stage.name], raw[j][`${stage.name} Pos`]),
          name: check(raw[j].name),
          rider_uid: this.checksum(raw[j].name),
          gender: raw[j].gender,
          class: this.className(raw[j].Class),
          club: raw[j].club || '',
          stage_time_ms: this.convertTimeMs(raw[j][stage.name], raw[j][`${stage.name} Pos`]),
          acc_time_ms: null,
          stage_rank: parseInt(raw[j][`${stage.name} Pos`], 10),
          status: this.setStatus(raw[j][`${stage.name} Pos`],)
        })
      }
    }

    //fix dns/dnf pos
    for(let i = 0; i < stages.length; i++) {
      const stage = stages[i]
      let pos = 0
      for(let j = 0; j < stage.results.length; j++) {
        if(Number.isNaN(stage.results[j].stage_rank)| Number.isNaN(stage.results[j].stage_rank)) {
          stage.results[j].stage_rank = pos++ + 1
        } else {
          pos = stage.results[j].stage_rank
        }

      }
    }

    return stages
  }

  convertTimeMs(time, pos) {
    if(pos !== 'DNS' && pos !== 'DNF') {
      return convertTimeToMs(time)
    }

    return 0
  }

  convertTime(time, pos) {
    if(pos !== 'DNS' && pos !== 'DNF') {
      return time
    }

    return '00:00:00'
  }

  setStatus(pos) {
    if(pos !== 'DNS' && pos !== 'DNF') {
      return 'OK'
    }
    return pos
  }

  findStages(rows) {
    const stages = []
    let stageNum = 1
    const row = rows[0]
    const keys = Object.keys(row)

    for(let i = 0; i < keys.length; i++) {
      const k = keys[i]
      const key = 'FE' + stageNum++
      if(row.hasOwnProperty(key) && !stages.find((e) => { return e.name === key })) {
        stages.push({ name: key, number: stageNum - 1 })
      }
    }
    return stages
  }
}


module.exports = Mylaps

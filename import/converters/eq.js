const { promisify } = require('util')
const csv = require('neat-csv')
const fs = require('await-fs')
const md5 = require('md5')
const logger = require('../logger.js')
const spellcheck = require('../spellcheck.js')

class EqConverter {
  constructor (filename) {
    this.filename = filename
  }

  async load () {
    const stats = await fs.stat(this.filename)

    if (stats.isFile()) {
      logger.info(`readin file ${this.filename}`)
      this.file = await fs.readFile(this.filename, 'utf-8')
      return this
    }

    logger.error(`File ${this.filename} was not found`)
    throw new Error(`file ${this.filename} does not exist`)
  }

  async parse () {
    const raw = await csv(this.file)
    return {
      race: {
        name: this.name(raw[0]),
        uid: this.raceChecksum(raw[0]),
        date: raw[0].Starttime.split(/T/)[0],
        year: this.year(raw[0]),
        stages: raw[0][' "RaceName"'].match(/(\d+)/)[1]
      },
      stage: {
        name: raw[0][' "RaceName"'].trim(),
        number: raw[0][' "RaceName"'].match(/(\d+)/)[1]
      },
      results: raw.map((row) => {
        const name = spellcheck.check(row.NameFormatted)
        return {
          rider_uid: this.checksum(name),
          name,
          gender: row.Gender,
          time: this.convertTime(row.NetTime),
          acc_time_ms: row.NetTime,
          rank: parseInt(row.RankClass, 10),
          class: (row.ClassName.indexOf(' ') !== -1) ? row.ClassName.split(/ /)[1] : row.ClassName,
          club: row.Club,
          team: row.Team,
          status: this.convertStatus(row.Status)
        }
      })
    }
  }

  name (obj) {
    const year = this.year(obj)
    return obj.EventName.replace(year, '').trim()
  }

  raceChecksum (obj) {
    return this.checksum(this.name(obj) + this.year(obj))
  }

  checksum (string) {
    return md5(string)
  }

  year (obj) {
    return obj.Starttime.split(/T/)[0].split(/-/)[0]
  }

  convertStatus (status) {
    if (status === 'TIME') {
      return 'OK'
    }
    return status
  }

  convertTime (seconds) {
    const fractionalSeconds = seconds.substr(seconds.length - 3, 1)
    let secs = seconds.substr(0, seconds.length - 3)
    secs = Number(secs)
    const m = Math.floor(secs % 3600 / 60)
    var s = Math.floor(secs % 3600 % 60)
    return `${m}:${s}.${fractionalSeconds}`
  }
}

module.exports = EqConverter

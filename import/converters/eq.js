const { promisify } = require('util')
const csv = require('neat-csv')
const fs = require('await-fs')
const md5 = require('md5')
const logger = require('../logger.js')
const spellcheck = require('../spellcheck.js')
const { convertMsToTime } = require('../../lib/time.js')

class EqConverter {
  constructor (filename) {
    this.filename = filename
  }

  async load () {
    const stats = await fs.stat(this.filename)

    if (stats.isFile()) {
      logger.info(`reading file ${this.filename}`)
      this.file = await fs.readFile(this.filename, 'utf-8')
      return this
    }

    logger.error(`File ${this.filename} was not found`)
    throw new Error(`file ${this.filename} does not exist`)
  }

  async parse (options) {
    const opts = options || { acc: true }

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
        const ret = {
          rider_uid: this.checksum(name),
          name,
          gender: row.Gender,
          time: convertMsToTime(row.NetTime),
          rank: parseInt(row.RankClass, 10),
          class: this.className(row.ClassName),
          club: row.Club,
          team: row.Team,
          status: this.convertStatus(row.Status)
        }

        return this.setTime(ret, opts, row.NetTime)

      })
    }
  }

  setTime(obj, opts, time) {
    if(opts.acc) {//accumulative mode, stage times are this stage plus the one before.
      if(obj.status !== 'OK') {
        obj.acc_time_ms = 0
      } else {
        obj.acc_time_ms = time
      }
    } else { //stage time is just that
      if(obj.status !== 'OK') {
        obj.stage_time_ms = 0
      } else {
        obj.stage_time_ms = time
      }
    }

    return obj
  }

  className(name) {
    if(/M.+junior|m.+jr/i.test(name)) {
      return 'Menn junior'
    } else if(/K.+junior|k.+jr/i.test(name)) {
        return 'Kvinner junior'
      } else if(/^M|Menn/i.test(name)) {
      return 'Menn senior'
    } else if(/^K|Kvinner/i.test(name)) {
      return 'Kvinner senior'
    } else if (/^\d/.test(name)) {
      return name.replace(/^\d\s?/, '')
    }
    return name
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
}

module.exports = EqConverter

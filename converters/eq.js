const { promisify } = require('util')
const csv = require('neat-csv')
const fs = require('await-fs')

class EqConverter {

  constructor(filename) {
    this.filename = filename
  }

  async load() {
    const stats = await fs.stat(this.filename)

    if(stats.isFile()) {
      this.file = await fs.readFile(this.filename, 'utf-8')
      return this
    }

    throw new Error(`file ${this.filename} does not exist`)
  }

  async parse() {
    const raw = await csv(this.file)

    return {
      race: {
        name: raw[0].EventName,
        date: raw[0].Starttime.split(/T/)[0]
      },
      stage: {
        name: raw[0][' "RaceName"'],
        number: raw[0][' "RaceName"'].match(/(\d+)/)[1]
      },
      results: raw.map((row) => {
        return {
          name: row.NameFormatted,
          gender: row.Gender,
          netTime: row.NetTimeFormatted,
          rank: parseInt(row.RankClass, 10),
          class: (row.ClassName.indexOf(' ') !== -1) ? row.ClassName.split(/ /)[1] : row.ClassName,
          club: row.Club,
          team: row.Team,
          status: row.Status
        }
      })
    }
  }
}

module.exports = EqConverter

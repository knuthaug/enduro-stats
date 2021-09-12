  /**
 * @fileOverview Super-class for converters with common methods shared between mylaps and eq converters
 * @name converter.js
 * @author  Knut Haugen
 * @license ISC
 */

const md5 = require('md5')
const { checkClub } = require('../spellcheck.js')

class Converter {
  raceChecksum (obj) {
    return this.checksum(this.raceName(obj) + this.year(obj))
  }

  checksum (string) {
    return md5(string)
  }

  clubName (name) {
    return checkClub(name)
  }

  className (name) {
    if (/Master menn|menn master|Master herrer/i.test(name)) {
      return 'Menn master'
    } else if (/master kvinner|kvinner master/i.test(name)) {
      return 'Kvinner master'
    } else if (/Kvinner Åpen.*17+/.test(name) || /Menn Åpen.*17+|Menn trim/i.test(name) || /.*Elduro.*/i.test(name) || /M\s?17-18/.test(name) || /Kvinner U23/.test(name)) {
      return name
    } else if (/K\s?17+/.test(name)) {
      return 'Kvinner senior'
    } else if (/M\s?17\+/.test(name)) {
      return 'Menn senior'
    } else if (/Funduro/i.test(name) || /Explorer/i.test(name) ||
               /M\s?\d\d|K\s?\d\d/i.test(name) || /Menn \d\d|Kvinner \d\d/i.test(name)) {
      return name
    } else if (/M.+junior|m.+jr/i.test(name)) {
      return 'Menn junior'
    } else if (/K.+junior|k.+jr/i.test(name)) {
      return 'Kvinner junior'
    } else if (/^Menn sport/i.test(name)) {
      return 'Menn sport'
    } else if (/^M|Menn/i.test(name)) {
      return 'Menn senior'
    } else if (/^K|Kvinner/i.test(name) || /Women/i.test(name)) {
      return 'Kvinner senior'
    } else if (/^\d/.test(name)) {
      return name.replace(/^\d\s?/, '')
    }
    return name
  }
}

module.exports = Converter

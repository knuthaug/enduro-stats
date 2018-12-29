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
    return this.checksum(this.name(obj) + this.year(obj))
  }

  checksum (string) {
    return md5(string)
  }

  clubName (name) {
    return checkClub(name)
  }

  className (name) {
    if (/Master menn|menn master/i.test(name)) {
      return 'Menn master'
    } else if (/kvinner menn|kvinner master/i.test(name)) {
      return 'Kvinner master'
    } else if (/Funduro/i.test(name) || /Explorer/i.test(name)
               || /M\d\d|K\d\d/i.test(name) || /Menn \d\d|Kvinner \d\d/i.test(name) ) {
      return name
    } else if (/M.+junior|m.+jr/i.test(name)) {
      return 'Menn junior'
    } else if (/K.+junior|k.+jr/i.test(name)) {
      return 'Kvinner junior'
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

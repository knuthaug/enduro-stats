const hashedAssets = require('../views/helpers/hashed-assets.js')
const compare = require('../views/helpers/compare.js')
const propFor = require('../views/helpers/propFor.js')
const toJson = require('../views/helpers/toJson.js')
const formatPercent = require('../views/helpers/formatPercent.js')
const isDNF = require('../views/helpers/isDNF.js')
const isDNS = require('../views/helpers/isDNS.js')
const isError = require('../views/helpers/isError.js')
const cat = require('../views/helpers/cat.js')
const isOK = require('../views/helpers/isOK.js')

module.exports = {
  hashedAssets,
  compare,
  propFor,
  toJson,
  formatPercent,
  isDNS,
  isDNF,
  isError,
  isOK,
  cat
}

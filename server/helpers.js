const hashedAssets = require('../views/helpers/hashed-assets.js')
const compare = require('../views/helpers/compare.js')
const propFor = require('../views/helpers/propFor.js')
const toJson = require('../views/helpers/toJson.js')
const formatPercent = require('../views/helpers/formatPercent.js')
const isDNF = require('../views/helpers/isDNF.js')
const isDNS = require('../views/helpers/isDNS.js')
const isDSQ = require('../views/helpers/isDSQ.js')
const isError = require('../views/helpers/isError.js')
const cat = require('../views/helpers/cat.js')
const isOK = require('../views/helpers/isOK.js')
const inc = require('../views/helpers/inc.js')
const title = require('../views/helpers/title.js')

module.exports = {
  title,
  hashedAssets,
  compare,
  propFor,
  toJson,
  formatPercent,
  isDNS,
  isDNF,
  isDSQ,
  isError,
  isOK,
  cat,
  inc
}

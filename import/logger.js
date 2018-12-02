const pino = require('pino')
const config = require('../config')

const logger = pino(pino.destination('./logs/import.log'), {
  name: 'enduro-stats-import',
  level: config.get('import.loglevel')
})

module.exports = logger

const pino = require('pino')
const fileLogger = pino(pino.destination('./logs/import.log'))
const config = require('../config')

const logger = pino(pino.destination('./logs/import.log'), {
  name: 'enduro-stats-import',
  level: config.get('import.loglevel')
})

module.exports = logger

const pino = require('pino')
const config = require('../config')

let logger

if(config.get('env') !== 'test') {
  logger = pino(pino.destination('./logs/import.log'), {
    name: 'enduro-stats-import',
    level: config.get('import.loglevel')
  })
} else {
  logger = pino({
    name: 'enduro-stats-import',
    level: config.get('import.loglevel')
  })
}
module.exports = logger

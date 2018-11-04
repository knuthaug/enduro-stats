const convict = require('convict')

const config = convict({
  env: {
    doc: 'The applicaton environment',
    format: ['local', 'test', 'stage', 'production'],
    default: 'local',
    env: 'NODE_ENV'
  },
  loglevel: {
    doc: 'Log level',
    format: '*',
    default: 'debug',
    env: 'APP_LOGLEVEL'
  },
  database: {
    host: {
      default: 'localhost',
    },
    username: {
      default: 'endurostats'
    },
    password: {
      default: 'endurostats'
    },
    database: {
      default: 'endurostats'
    }
  }
})

config.loadFile(`${__dirname}/${config.get('env')}-config.json`)
config.validate({
  allowed: 'strict'
})

module.exports = config

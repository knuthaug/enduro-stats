const convict = require('convict')

const config = convict({
  env: {
    doc: 'The applicaton environment',
    format: ['local', 'test', 'dev', 'production'],
    default: 'local',
    env: 'NODE_ENV'
  },
  loglevel: {
    doc: 'Log level',
    format: '*',
    default: 'debug',
    env: 'APP_LOGLEVEL'
  },
  import: {
    loglevel: {
      default: 'info'
    }
  },
  database: {
    host: {
      default: 'localhost',
      env: 'DATABASE_HOST'
    },
    username: {
      default: 'endurostats',
      env: 'DATABASE_USER'
    },
    password: {
      default: 'endurostats',
      env: 'DATABASE_PASSWORD'
    },
    database: {
      default: 'endurostats',
      env: 'DATABASE'
    }
  }
})

config.loadFile(`${__dirname}/${config.get('env')}-config.json`)
config.validate({
  allowed: 'strict'
})

module.exports = config

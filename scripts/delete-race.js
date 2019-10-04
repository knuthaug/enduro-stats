const cmd = require('command-line-args')
const Db = require('../import/db.js')
const optionDefinitions = [
  { name: 'uid', type: String, defaultOption: true }
]

const options = cmd(optionDefinitions)
const db = new Db()
db.deleteRace(options.uid)


const Db = require('./db.js')
const fs = require('fs')
const path = require('path')

const db = new Db()

if (process.argv.length <= 3) {
  console.log("Usage: " + __filename + " race year")
  process.exit(-1)
}

call()

async function call() {
  const results = await db.raceResults('NesbyEnduro', 2013, 'Menn')
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

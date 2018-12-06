const Db = require('../server/db.js')
const fs = require('fs')
const path = require('path')

const db = new Db()

call()

async function call () {
  const results = await db.raceResults('4504e3dd07d15dec4044e6b2e32df739')
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

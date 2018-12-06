const Db = require('../server/db.js')
const fs = require('fs')
const path = require('path')

const db = new Db()

call()

async function call () {
  const results = await db.raceResults('b5abd441f9b8afd93fc95a897d33d2a4')
  console.log(JSON.stringify(results, null, 2))
  db.destroy()
}

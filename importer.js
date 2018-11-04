const { Pool } = require('pg')
const config = require('./config')

const options = {
  host: config.get('database.host'),
  database: config.get('database.database'),
  user: config.get('database.username'),
  password: config.get('database.password'),
}

const pool = new Pool(options)

run()

async function run() {
  const res = await pool.query('SELECT NOW()')
  console.log(res)
  await pool.end()
}

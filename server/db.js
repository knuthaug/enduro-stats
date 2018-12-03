const { Pool } = require('pg')
const config = require('../config')

const options = {
  host: config.get('database.host'),
  database: config.get('database.database'),
  user: config.get('database.username'),
  password: config.get('database.password')
}

class Db {
  constructor () {
    this.pool = new Pool(options)
  }

  async findRaces (limit) {
    let query = 'SELECT * from races ORDER by YEAR DESC'
    const values = []

    if(limit) {
      query = `${query} LIMIT $1`
      values[0] = limit
    }

    return this.find(query, values)
  }

  async findRace (uid) {
    const query = 'SELECT * from races WHERE uid = $1'
    const values = [uid]
    const rows = await this.find(query, values)

    if (rows.length > 0) {
      return rows[0]
    }
    return {}
  }

  async find (query, values) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      return res.rows
    } catch (error) {
      console.log(error)
      return []
    } finally {
      await client.release()
    }
  }
}

module.exports = Db

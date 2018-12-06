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

  async findRider (uid) {
    const query = 'SELECT * from riders WHERE uid = $1'
    const values = [uid]
    const rows = await this.find(query, values)

    if (rows.length > 0) {
      return rows[0]
    }
    return {}
  }

  async findAllRiders () {
    const query = 'select riders.uid, riders.name, riders.club, (SELECT count(race_id) from rider_races where rider_id = riders.id) from riders order by count DESC'
    const values = []
    return this.find(query, values)
  }

  async findRacesForRider(uid) {
    const query = 'select rider_id, final_rank, races.name, races.year, races.uid from rider_races JOIN races ON races.id  = race_id WHERE rider_id = (SELECT id from riders where uid = $1) group by rider_id, races.name, races.year, races.uid, final_rank'
    const values = [uid]
    return this.find(query, values)
  }

  async classesForRace (uid) {
    const query = 'SELECT DISTINCT class from results where race_id = (SELECT id FROM races WHERE uid = $1)'
    const values = [uid]
    const rows = await this.find(query, values)

    if (rows.length > 0) {
      return rows.map((r) => { return r.class })
    }
    return []
  }

  async raceResults(uid) {
    const query = 'SELECT *, (SELECT number FROM stages WHERE id = results.stage_id) as stage, (SELECT name FROM riders where id = results.rider_id) as name, (SELECT uid from riders WHERE id = results.rider_id) as uid FROM results WHERE race_id = (SELECT id FROM races where uid = $1) ORDER BY class, stage_id, rank'
    const values = [uid]
    return this.find(query, values)
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

  destroy () {
    this.pool.end()
  }
}

module.exports = Db

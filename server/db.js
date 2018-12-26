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
    let query = 'SELECT * from races ORDER by YEAR DESC, date DESC'
    const values = []

    if (limit) {
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

  async findRaceLinks (id) {
    const query = 'SELECT * from race_links WHERE race_id = $1'
    const values = [id]
    return this.find(query, values)
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

  async findRacesForRider (uid) {
    const query = 'select rider_id, final_rank, races.name, races.year, races.id, races.uid from rider_races JOIN races ON races.id  = race_id WHERE rider_id = (SELECT id from riders where uid = $1) group by rider_id, races.name, races.year, races.uid, races.id, final_rank order by races.year DESC'
    const values = [uid]
    return this.find(query, values)
  }

  async raceResultsForRider (uid) {
    const query = 'SELECT results.*, race_id, ra.name, ra.uid, ra.date, ra.year FROM results LEFT OUTER JOIN (SELECT id, name, uid, date, year from races) AS ra ON ra.id = results.race_id WHERE results.rider_id = (SELECT id from riders where uid = $1)'

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

  async ridersForClassAndRace (races) {
    const out = {}
    const query = `select race_id, stage_id, count(id) from results where race_id = $1 and class = $2 group by race_id, stage_id order by race_id limit 1`

    for (let i = 0; i < races.length; i++) {
      const row = await this.find(query, [races[i].race, races[i].class])
      out[row[0].race_id] = row[0].count
    }
    return out
  }

  async raceResults (uid) {
    const query = 'SELECT *, (SELECT number FROM stages WHERE id = results.stage_id) as stage, (SELECT name FROM riders where id = results.rider_id) as name, (SELECT uid from riders WHERE id = results.rider_id) as uid FROM results WHERE race_id = (SELECT id FROM races where uid = $1) ORDER BY class, stage_id, final_rank'
    const values = [uid]
    return this.find(query, values)
  }

  async search(search) {
    const query = "select id, name, uid from riders where search @@ to_tsquery('norwegian', $1);"
    return this.find(query, [search])
  }

  async searchLike(search) {
    const query = "select id, name, uid from riders where name ilike $1"
    return this.find(query, [`%${search}%`])
  }

  async statCounts() {
    const query = 'select count(id) from races'
    const raceCount = await this.findOne(query, [], 'count')

    const query2 = 'select count(id) from riders'
    const riderCount = await this.findOne(query2, [], 'count')

    const query3 = 'select count(id) from stages'
    const stageCount = await this.findOne(query3, [], 'count')

    return { raceCount, riderCount, stageCount }
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

  async findOne (query, values, field) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      return res.rows[0][field]
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

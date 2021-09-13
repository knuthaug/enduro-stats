const { Pool } = require('pg')
const config = require('../config')

const options = {
  host: config.get('database.host'),
  database: config.get('database.database'),
  user: config.get('database.username'),
  password: config.get('database.password'),
  max: 5
}

class Db {
  constructor () {
    this.pool = new Pool(options)
    this.winnerTimeOfRace = this.memoize(this.winnerTimeOfRace)
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

  async raceLinks (raceId) {
    const query = 'SELECT * from race_links WHERE race_id = $1 order by type DESC'
    const values = [raceId]
    return this.find(query, values)
  }

  async stageDetails (raceUid) {
    const query = 'SELECT * from stages_details WHERE race_id = (select id from races where uid = $1) order by name'
    const values = [raceUid]
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

  async findRiders (uids) {
    let i = 1
    const placeholders = uids.map((u) => {
      return `$${i++}`
    })

    const query = `SELECT * from riders WHERE uid in(${placeholders})`
    const rows = await this.find(query, uids)

    return rows
  }

  async allSeriesResultsForRider(uid) {
    const query = 'select id, race_id, (select name from races where race_id = id) as race_name, (select uid from races where race_id = id) as race_uid, (select year from races where race_id = id) as race_year, (select date from races where race_id = id) as race_date, class, final_rank, acc_time_ms, acc_time_behind, (SELECT series from races where id = race_id) as series, (SELECT uid FROM riders where id = results.rider_id) as uid, (SELECT name FROM riders where id = results.rider_id) as name from results where race_id in (select id from races where (series = $1 OR series = $2)) AND class NOT ILIKE $3 AND class NOT ILIKE $4 AND final_rank IS NOT NULL AND (SELECT uid FROM riders where id = results.rider_id) = $5 order by series, race_year, race_date, class, final_rank'
    const values = ['80/20 enduro series', 'Østafjells enduroserie', '%funduro%', '%explorer%', uid]
    return this.find(query, values)
  }

  async findAllRiders () {
    const query = 'select riders.id, riders.uid, riders.name, riders.gender, riders.club, (SELECT count(race_id) from rider_races where rider_id = riders.id) from riders order by count DESC'
    const values = []
    return this.find(query, values)
  }

  async winnerTimeOfRace (raceId, gender, raceUid) {
    const query = 'select results.id, acc_time_ms from results, riders where race_id = $1 and acc_time_ms = (select min(acc_time_ms) from results, riders where race_id = $1 and acc_time_ms != 0 and results.rider_id = riders.id and riders.gender = $2 and results.class like $3 and final_rank IS NOT null) and results.rider_id = riders.id'

    let classPrefix = ''
    if(raceUid === '77f9b01807c96affc1e54cd41b0583dc' || raceUid === '0d9c144ca0063d89c64b9e263276efbe') { // special case for races with only youth
      classPrefix = gender === 'F' ? 'K%' : 'M%';
    } else {
      classPrefix = gender === 'F' ? 'Kvinner%' : 'Menn%'
    }

    const values = [raceId, gender, classPrefix]
    return this.findOne(query, values, 'acc_time_ms')
  }

  async findRacesForRider (uid) {
    const query = 'select rider_id, final_rank, races.name, races.year, races.id, races.uid from rider_races JOIN races ON races.id  = race_id WHERE rider_id = (SELECT id from riders where uid = $1) group by rider_id, races.name, races.year, races.uid, races.id, final_rank order by races.year DESC'
    const values = [uid]
    return this.find(query, values)
  }

  async raceResultsForRider (uid) {
    const query = 'SELECT results.*, riders.name, riders.gender, (select name from stages where id = results.stage_id) as stageName, race_id, ra.name, ra.uid, ra.date, ra.year FROM results LEFT OUTER JOIN (SELECT id, name, uid, date, year from races) AS ra ON ra.id = results.race_id LEFT OUTER JOIN (select id, name, gender from riders ) as riders on results.rider_id = riders.id WHERE results.rider_id = (SELECT id from riders where uid = $1) order by stage_id ASC'

    const values = [uid]
    return this.find(query, values)
  }

  async riderRanks (gender) {
    const query = 'SELECT rr.id, rr.rider_id, rr.score, max_sequence, r.name, r.uid, r.club, rr.date FROM rider_rankings rr INNER JOIN (SELECT rider_id, MAX(sequence_number) max_sequence FROM rider_rankings GROUP BY rider_id) b ON rr.rider_id = b.rider_id AND b.max_sequence = rr.sequence_number JOIN Riders r on rr.rider_id = r.id where r.gender = $1 order by score'
    const values = [gender]
    return this.find(query, values)
  }

  async riderRanking (riderId) {
    const query = 'SELECT best_year as year, average_best_year as avg, score FROM riders, rider_rankings where rider_rankings.rider_id = riders.id and riders.id = $1 and sequence_number = (SELECT max(sequence_number) from rider_rankings where rider_id = $1)'

    const values = [riderId]
    const result = await this.find(query, values)
    return result[0]
  }

  async raceResultsForRiders (uids) {
    let i = 1
    const placeholders = uids.map((u) => {
      return `$${i++}`
    })

    const query = `SELECT results.*, (select name from stages where id = results.stage_id) as stageName, (select number from stages where id = results.stage_id) as stage, rid.uid as uid, rid.name as name, race_id, ra.name as race_name, ra.uid as race_uid, ra.date, ra.year FROM results LEFT OUTER JOIN (SELECT id, name, uid, date, year from races) AS ra ON ra.id = results.race_id LEFT OUTER JOIN (SELECT id, uid, name from riders) AS rid ON results.rider_id = rid.id WHERE results.rider_id in (SELECT id from riders where uid in (${placeholders})) order by stage_id ASC`
    return this.find(query, uids)
  }

  async raceResultsForRaceAndRiders (race, uids) {
    let i = 1
    const placeholders = uids.map((u) => {
      return `$${i++}`
    })

    const query = `SELECT results.*, (select name from stages where id = results.stage_id) as stageName, (select number from stages where id = results.stage_id) as stage, rid.uid as uid, rid.name as name, race_id, ra.name as race_name, ra.uid as race_uid, ra.date, ra.year FROM results LEFT OUTER JOIN (SELECT id, name, uid, date, year from races) AS ra ON ra.id = results.race_id LEFT OUTER JOIN (SELECT id, uid, name from riders) AS rid ON results.rider_id = rid.id WHERE ra.uid = $${i} AND results.rider_id in (SELECT id from riders where uid in (${placeholders})) order by stage_id ASC`
    uids.push(race)
    const params = uids
    return this.find(query, params)
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
    const query = 'select race_id, stage_id, count(id) from results where race_id = $1 and class = $2 group by race_id, stage_id order by race_id limit 1'

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

  async racesBySeriesAndYear(series, year) {
    const query = 'select id, race_id, (select uid from riders where id = rider_id) as uid, (select name from races where race_id = id) as race_name, (select date from races where race_id = id) as race_date, class, final_rank, acc_time_ms, acc_time_behind, (SELECT name FROM riders where id = results.rider_id) as name from results where race_id in (select id from races where series = $1 and year = $2) AND final_rank IS NOT NULL AND class NOT ILIKE $3 AND class NOT ILIKE $4 order by race_date, class, final_rank'

    const values = [series, year, '%funduro%', '%explorer%']
    return this.find(query, values)
  }

  async search (search, limit) {
    const l = limit || 15

    if (search.indexOf(' ') !== -1) {
      search = search.replace(/ /, ' & ')
    }

    const query = "select id, name, club, uid from riders where search @@ to_tsquery('norwegian', $1) limit $2"
    return this.find(query, [search, l])
  }

  async searchLike (search, limit) {
    const l = limit || 15
    const query = 'select id, name, club, uid from riders where name ilike $1 limit $2'
    return this.find(query, [`%${search}%`, l])
  }

  async statCounts () {
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
      if (!res.rows[0]) {
        console.log(`Didn't find record ${field} for values≈${values}`)
      }
      return res.rows[0][field]
    } catch (error) {
      console.log(error)
      return []
    } finally {
      await client.release()
    }
  }

  memoize (func) {
    const cache = {}
    return async function (...args) {
      const n = args.join('_')
      if (cache.hasOwnProperty(n)) {
        return cache[n]
      } else {
        const fn = func.bind(this)
        const result = await fn(...args)
        cache[n] = result
        return cache[n]
      }
    }.bind(this)
  }

  async destroy () {
    this.pool.end()
  }
}

module.exports = Db

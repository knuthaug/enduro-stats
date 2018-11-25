const { Pool } = require('pg')
const config = require('../config')

const options = {
  host: config.get('database.host'),
  database: config.get('database.database'),
  user: config.get('database.username'),
  password: config.get('database.password'),
}

class Db {
  constructor() {
    this.pool = new Pool(options)
  }

  async insert(query, values) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      return res
    } catch(error) {
      console.log(error)
      return { error } 
    } finally {
      await client.release()
    }
  }

  async update(query, values) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      return res
    } catch(error) {
      console.log(error)
      return { error }
    } finally {
      await client.release()
    }
  }

  async insertRace(race) {
    const id = await this.findRace(race.name, race.year)
    if(id) {
      //update stage number
      return this.update('UPDATE RACES SET stages = $1 WHERE id = $2', [race.stages, id])
    }

    const query = 'INSERT INTO races(name, stages, date, year, uid) VALUES($1, $2, $3, $4, $5)'
    const values = [race.name, race.stages, race.date, race.year, race.uid]
    return this.insert(query, values)
  }

  async insertStage(race, stage, raceYear) {

    const stageId = await this.findStage(stage.name, stage.number)
    if(stageId){
      console.log(`found stageId = ${stageId}`)
      return stageId
    } 

    const query = 'INSERT INTO stages(name, number, race_id) VALUES($1, $2, (SELECT r.id FROM races r WHERE r.name = $3 AND r.year = $4))'
    const values = [stage.name, parseInt(stage.number, 10), race, raceYear]
    return this.insert(query, values)
  }

  async insertLogEntry(race, stage) {
    const query = 'INSERT INTO insert_log(race_id, stage_id) VALUES($1, $2)'
    const values = [race, stage]
    return this.insert(query, values)
  }

  async insertResult(raceId, riderId, stageNumber, result) {
    //console.log('inserting row for rider ' + riderId)
    const query = 'INSERT INTO raw_results(rank, time, timems, status, class, stage_id, rider_id, race_id) VALUES($1, $2, $3, $4, $5, (SELECT id from stages where race_id = $7 and number = $8), $6, $7)'
    const values = [result.rank, result.time, parseInt(result.timems, 10), result.status, result.class, riderId, raceId, stageNumber]
    return this.insert(query, values)
  }

  async insertResults(raceName, raceYear, stage, results) {
    for(let i = 0; i < results.length; i++) {
      const result = results[i]
      const rider = {
        name: result.name,
        gender: result.gender,
        club: result.club,
        team: result.team
      }
      //console.log('rider ' + result.name)
      const riderId = await this.insertRider(rider)
      const raceId = await this.findRace(raceName, raceYear)
      await this.insertResult(raceId, parseInt(riderId, 10), parseInt(stage.number, 10), result)
    }
  }

  async insertRider(rider) {
    const client = await this.pool.connect()

    try {
      const query = 'WITH inserted as (INSERT INTO riders(name, gender, club, team) VALUES($1, $2, $3, $4) ON CONFLICT(name, gender) DO NOTHING RETURNING *) select id FROM inserted'
      const values = [rider.name, rider.gender, rider.club, rider.team]
      const res = await client.query(query, values)
      //console.log(res.rows)
      if(res.rows.length === 1) {
        return res.rows[0].id
      } else {
        const riderId = await this.findRider(rider.name, rider.gender)
        //console.log('found rider ' + riderId)
        return riderId
      }
    } catch(error) {
      console.log(error)
    } finally {
      await client.release()
    }
  }

  async find(query, values, msg) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      if(!res.rows[0]) {
        console.log(msg)
        return 0
      }
      return res.rows[0].id
    } catch(error) {
      console.log(error)
      return undefined
    } finally {
      await client.release()
    }
  }

  async findSet(query, values, msg) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      return res.rows
    } catch(error) {
      console.log(error)
      return []
    } finally {
      await client.release()
    }
  }

  async raceResults(raceName, raceYear) {
    const query = 'SELECT * FROM raw_results where race_id = (SELECT id FROM races WHERE name = $1 and year = $2)'
    const values = [raceName, raceYear]
    return this.findSet(query, values, `Error finding all results for race name=${raceName}, year=${raceYear}`)
  }

  async findRider(name, gender) {
    const query = 'SELECT id FROM riders where name = $1 AND gender = $2'
    const values = [name, gender]
    return this.find(query, values, `Error: could not find rider for name='${name}' and and gender=${gender}`)
  }

  async findRace(name, year) {
    const query = 'SELECT id FROM races where name = $1 AND year = $2'
    const values = [name, year]
    return this.find(query, values, `Error: could not find race for name='${name}' and year=${year}`)
  }

  async findStage(name, stageNumber) {
    const query = 'SELECT id FROM stages where name = $1 AND number = $2'
    //console.log(`trying to find stage for name = ${name} number=${stageNumber}`)
    const values = [name, stageNumber]
    return this.find(query, values, `Error: could not find stage for name='${name}' and number=${stageNumber}`)
  }

  destroy() {
    this.pool.end()
  }
}

module.exports = Db

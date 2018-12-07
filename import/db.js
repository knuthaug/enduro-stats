const { Pool } = require('pg')
const config = require('../config')
const logger = require('./logger.js')

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

  async insert (query, values) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      return res
    } catch (error) {
      logger.error(`error for insert! Query: ${query}, values:${values}`)
      logger.error(error)
      return { error }
    } finally {
      await client.release()
    }
  }

  async update (query, values) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      return res
    } catch (error) {
      logger.error(`error for update! Query: ${query}, values:${values}`)
      logger.error(error)
      return { error }
    } finally {
      await client.release()
    }
  }

  async insertRace (race) {
    const id = await this.findRace(race.name, race.year)

    if (id) {
      // update stage number
      logger.info(`updating race ${race.name} year=${race.year} with stage = ${race.stages}`)
      await this.update('UPDATE RACES SET stages = $1 WHERE id = $2', [race.stages, id])
      return id
    }

    logger.info(`Inserting race ${race.name} year=${race.year} into races`)
    const query = 'INSERT INTO races(name, stages, date, year, uid) VALUES($1, $2, $3, $4, $5)'
    const values = [race.name, race.stages, race.date, race.year, race.uid]
    await this.update(query, values)
    return this.findRace(race.name, race.year)
  }

  async insertStage (race, stage, raceId) {
    const stageId = await this.findStage(stage.name, stage.number, raceId)

    if (stageId) {
      logger.debug(`found stageId = ${stageId}`)
      return stageId
    }

    logger.info(`Inserting stage ${stage.name}, stage number ${stage.number} for race id ${raceId}`)
    const query = 'INSERT INTO stages(name, number, race_id) VALUES($1, $2, $3)'
    const values = [stage.name, parseInt(stage.number, 10), raceId]
    return this.insert(query, values)
  }

  async insertLogEntry (race, stage) {
    const query = 'INSERT INTO insert_log(race_id, stage_id) VALUES($1, $2)'
    const values = [race, stage]
    return this.insert(query, values)
  }

  async insertRaceForRider (raceId, riderId, finalRank) {
    const q = 'SELECT id from rider_races WHERE race_id = $1 AND rider_id = $2'
    const found = await this.find(q, [raceId, riderId])
    logger.info(`found rider_race id=${found}`)

    if (!found) {
      logger.info(`inserting rider_race for race=${raceId}, rider=${riderId}`)
      const query = 'INSERT INTO rider_races(race_id, rider_id, final_rank) VALUES($1, $2, $3)'
      const values = [raceId, riderId, finalRank]
      return this.insert(query, values)
    }

    return found
  }

  async insertRawResult (raceId, riderId, stageNumber, result) {
    const query = 'INSERT INTO raw_results(rank, time, status, class, stage_id, rider_id, race_id, acc_time_ms, stage_time_ms) VALUES($1, $2, $3, $4, (SELECT id from stages where race_id = $6 and number = $7), $5, $6, $8, $9)'
    const values = [result.rank, result.time, result.status, result.class, riderId, raceId, stageNumber, result.acc_time_ms, result.stage_time_ms]
    return this.insert(query, values)
  }

  async insertCalculatedResults (raceId, result) {
    const query = 'INSERT INTO results(rank, time, acc_time_ms, status, class, stage_id, rider_id, race_id, stage_time_ms, stage_rank, behind_leader_ms, acc_time_behind, final_rank) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)'
    for (let i = 0; i < result.length; i++) {
      // console.log(result[i])
      const stageId = await this.findStageByRace(raceId, result[i].stage)
      const values = [result[i].rank,
        result[i].time,
        result[i].acc_time_ms,
        result[i].status,
        result[i].class,
        stageId,
        result[i].rider_id,
        raceId,
        result[i].stage_time_ms,
        result[i].stage_rank,
        result[i].behind_leader_ms,
        result[i].acc_time_behind,
        result[i].final_rank]
      // console.log(values)
      await this.insert(query, values)
      await this.insertRaceForRider(raceId, result[i].rider_id, this.finalRank(result, result[i].rider_id))
    }
  }

  finalRank (rows, riderId) {
    const lastStage = rows.reduce((acc, current) => {
      return current.stage > acc ? current.stage : acc
    }, 0)

    return rows.find((r) => {
      return r.rider_id === riderId && r.stage === lastStage
    }).final_rank
  }

  async insertRawResults (raceName, raceYear, stage, results) {
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      const rider = {
        name: result.name,
        gender: result.gender,
        club: result.club,
        team: result.team,
        uid: result.rider_uid
      }

      const riderId = await this.insertRider(rider)
      const raceId = await this.findRace(raceName, raceYear)
      await this.insertRawResult(raceId, parseInt(riderId, 10), parseInt(stage.number, 10), result)
      logger.info(`inserting raw result for rider ${riderId}`)
    }
  }

  async insertRider (rider) {
    const client = await this.pool.connect()
    const query = 'WITH inserted as (INSERT INTO riders(name, gender, club, team, uid) VALUES($1, $2, $3, $4, $5) ON CONFLICT(name, gender) DO NOTHING RETURNING *) select id FROM inserted'
    const values = [rider.name, rider.gender, rider.club, rider.team, rider.uid]

    try {
      const res = await client.query(query, values)
      // console.log(res.rows)
      if (res.rows.length === 1) {
        logger.info(`Inserted rider ${res.rows[0].id}`)
        return res.rows[0].id
      } else {
        const riderId = await this.findRider(rider.name, rider.gender)
        logger.info(`Found existing rider rider ${riderId}`)
        return riderId
      }
    } catch (error) {
      logger.error(`Error for inserting rider: query:${query}: values${values}`)
      logger.error(error)
    } finally {
      await client.release()
    }
  }

  async find (query, values, msg) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      if (!res.rows[0]) {
        logger.warn(msg)
        return 0
      }
      return res.rows[0].id
    } catch (error) {
      logger.error(error)
      return undefined
    } finally {
      await client.release()
    }
  }

  async findSet (query, values, msg) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      return res.rows
    } catch (error) {
      logger.error(error)
      return []
    } finally {
      await client.release()
    }
  }

  async classesForRace (raceId) {
    const query = 'SELECT DISTINCT class from raw_results WHERE race_id = $1'
    const values = [raceId]
    return this.findSet(query, values, `Error finding all classes for race name=${raceId}`)
  }

  async rawRaceResults (raceName, raceYear, className) {
    logger.info(`raceResults:${raceName}, ${raceYear}, ${className}`)
    const query = 'SELECT *,(SELECT number FROM stages where id = raw_results.stage_id) as stage FROM raw_results where race_id = (SELECT id FROM races WHERE name = $1 and year = $2) AND class = $3'
    const values = [raceName, raceYear, className]
    return this.findSet(query, values, `Error finding all results for race name=${raceName}, year=${raceYear}`)
  }

  async findRider (name, gender) {
    const query = 'SELECT id FROM riders where name = $1 AND gender = $2'
    const values = [name, gender]
    return this.find(query, values, `Error: could not find rider for name='${name}' and and gender=${gender}`)
  }

  async findRace (name, year) {
    const query = 'SELECT id FROM races where name = $1 AND year = $2'
    const values = [name, year]
    return this.find(query, values, `Error: could not find race for name='${name}' and year=${year}`)
  }

  async findStage (name, stageNumber, raceId) {
    const query = 'SELECT id FROM stages where name = $1 AND number = $2 and race_id = $3'
    // console.log(`trying to find stage for name = ${name} number=${stageNumber}`)
    const values = [name, stageNumber, raceId]
    return this.find(query, values, `Error: could not find stage for name='${name}' and number=${stageNumber}, raceId=${raceId}`)
  }

  async findStageByRace (raceId, stageNumber) {
    const query = 'SELECT id FROM stages where race_id = $1 AND number = $2'
    // console.log(`trying to find stage for name = ${name} number=${stageNumber}`)
    const values = [raceId, stageNumber]
    return this.find(query, values, `Error: could not find stage for race_id='${raceId}' and number=${stageNumber}`)
  }

  destroy () {
    this.pool.end()
  }
}

module.exports = Db

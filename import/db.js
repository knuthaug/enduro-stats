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
    this.schema = config.get('database.schema');
    this.pool = new Pool(options)
    this.pool.on('connect', (client) => {
      console.log('set schema to', config.get('database.schema'))
      client.query(`SET search_path TO "${config.get('database.schema')}"`);
    });
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

  async deleteRace (uid) {
    const id = await this.find('SELECT id from races where uid = $1', [uid], '')

    await this.update('DELETE FROM raw_results where race_id = $1', [id])
    await this.update('DELETE FROM results where race_id = $1', [id])
    await this.update('DELETE FROM stages where race_id = $1', [id])
    await this.update('DELETE FROM stages_details where race_id = $1', [id])
    await this.update('DELETE FROM stages_details where race_id = $1', [id])
    await this.update('DELETE FROM race_links where race_id = $1', [id])
    await this.update('DELETE FROM rider_races where race_id = $1', [id])
    await this.update('DELETE FROM races where id = $1', [id])
  }

  async updateClub (id, club) {
    const query = 'UPDATE riders set club = $1 where id = $2'
    return this.update(query, [club, id])
  }

  async insertRace (race, stages) {

    const id = await this.findRace(race.name, race.year)

    if (id) {
      // update stage number
      logger.info(`updating race ${race.name} year=${race.year} with stages = ${stages}`)
      await this.update('UPDATE RACES SET stages = $1 WHERE id = $2', [stages, id])
      return id
    }

    logger.info(`Inserting race ${race.name} year=${race.year} into races`)
    const query = 'INSERT INTO races(name, stages, date, year, uid, text, series, lat, long, zoom, byline_text, byline_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'
    const values = [race.name, stages, race.date, race.year, race.uid, race.text, race.series, race.lat, race.long, race.zoom, race.byline_text, race.byline_url]
    await this.insert(query, values)
    return this.findRace(race.name, race.year)
  }

  async insertRaceLinks (raceId, links) {

    const id = await(this.findRaceLinks(raceId));

    if(id){
      logger.info('Found existing race links: updating...');
      this.update('DELETE FROM race_links where race_id = $1', [raceId]);
    }

    logger.info(`Inserting race links for race id ${raceId}`)
    const query = 'INSERT INTO race_links(type, url, description, race_id) VALUES($1, $2, $3, $4)'

    for (let i = 0; i < links.length; i++) {
      const values = [links[i].type, links[i].url, links[i].desc, raceId]
      this.insert(query, values)
    }
  }

  async findRaceLinks(raceId) {
    const query = 'SELECT id from race_links where race_id = $1';
    const values = [raceId]
    return this.find(query, values, `Error: could not find race links for race_id='${raceId}'`)
  }

  async insertStageDetails (raceId, details) {
    const id = this.findStageDetails(raceId);

    if(id) {
      logger.info('Found existing stage details. Updating...');
      await this.update('DELETE FROM stages_details where race_id = $1', [raceId]);
    }

    logger.info(`Inserting stage details for race id ${raceId}`)
    const query = 'INSERT INTO stages_details(name, strava_name, strava_url, filename, race_id) VALUES($1, $2, $3, $4, $5)'

    for (let i = 0; i < details.length; i++) {
      const values = [details[i].name, details[i].strava_name, details[i].strava_url, details[i].file, raceId]
      await this.insert(query, values)
      logger.info(`inserted stage details for stage ${details[i].name}`);
    }
  }

  async findStageDetails(raceId) {
    const query = 'SELECT id from stages_details where race_id = $1';
    const values = [raceId]
    return this.find(query, values, `Error: could not find stage details for race_id='${raceId}'`)
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
    logger.info(`found rider_race id=${found}. Inserting raw results for rider`)

    if (!found) {
      logger.info(`inserting rider_race for race=${raceId}, rider=${riderId}`)
      const query = 'INSERT INTO rider_races(race_id, rider_id, final_rank) VALUES($1, $2, $3)'
      const values = [raceId, riderId, finalRank]
      return this.insert(query, values)
    }

    return found
  }

  async insertRawResult (raceId, riderId, stageNumber, result) {
    const query = 'INSERT INTO raw_results(rank, time, status, class, stage_id, rider_id, race_id, acc_time_ms, stage_time_ms, stage_rank, final_status, bib) VALUES($1, $2, $3, $4, (SELECT id from stages where race_id = $6 and number = $7), $5, $6, $8, $9, $10, $11, $12)'
    const values = [result.rank, result.time, result.status, result.class, riderId, raceId, stageNumber, result.acc_time_ms, result.stage_time_ms, result.stage_rank, result.final_status, result.bib]
    return this.insert(query, values)
  }

  async insertCalculatedResults (raceId, result) {
    const query = 'INSERT INTO results(rank, time, acc_time_ms, status, class, stage_id, rider_id, race_id, stage_time_ms, stage_rank, behind_leader_ms, acc_time_behind, final_rank, behind_leader_percent, final_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)'
    for (let i = 0; i < result.length; i++) {
      // console.log(result[i])
      const stageId = await this.findStageByRace(raceId, result[i].stage)
      const values = [
        result[i].rank,
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
        result[i].final_rank,
        result[i].behind_leader_percent,
        result[i].final_status
      ]
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

  async findAllRiders () {
    const query = 'select riders.id, riders.uid, riders.name, riders.gender, riders.club, (SELECT count(race_id) from rider_races where rider_id = riders.id) from riders order by count DESC'
    const values = []
    return this.findSet(query, values)
  }

  async ridersForRace (raceId) {
    const query = 'select distinct riders.id, riders.uid, riders.name from riders, rider_races where rider_races.rider_id = riders.id and rider_races.race_id = $1'
    const values = [raceId]
    return this.findSet(query, values)
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
      // logger.info(`inserting raw result for rider ${riderId}`)
    }
  }

  async addRankings (riderId, year, avgScore, rank, date) {
    const { seq } = await this.findAll('select max(sequence_number) as seq from rider_rankings where rider_id = $1', [riderId])

    logger.info(`Inserting rankings for rider ${riderId}`)
    const query = 'INSERT INTO rider_rankings(rider_id, best_year, average_best_year, score, sequence_number, date) VALUES($1, $2, $3, $4, $5, $6)'
    const values = [riderId, year, avgScore, rank, seq ? seq + 1 : 1, date]
    return this.insert(query, values)
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
        const { id, club } = await this.findRider(rider.name, rider.gender)
        logger.info(`Found existing rider ${id} (club=${club} | rider.club=${rider.club})`)

        if ((typeof club === 'undefined' && rider.club !== '') && club !== rider.club) {
          logger.info(`updating club for rider ${id}, setting club=${rider.club}`)
          await this.updateClub(id, rider.club)
        }

        return id
      }
    } catch (error) {
      logger.error(`Error for inserting rider: query:${query}: values: ${values}`)
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

  async findAll (query, values, msg) {
    const client = await this.pool.connect()
    try {
      const res = await client.query(query, values)
      if (!res.rows[0]) {
        logger.warn(msg)
        return 0
      }
      return res.rows[0]
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

  async ridersWithoutImage (raceId) {
    const query = 'SELECT DISTINCT riders.id, name, raw_results.bib, riders.uid from riders, raw_results where riders.id = raw_results.rider_id AND raw_results.race_id = $1 and (riders.byline_text IS null or riders.byline_text = \'\')'
    const values = [raceId]
    return this.findSet(query, values, `Error finding riders without images for race id=${raceId}`)
  }

  async addByline (riderId, bylineText, bylineUrl, imageMode) {
    return this.update('update riders set byline_text = $1, byline_url = $2, image_mode = $3  where id = $4', [bylineText, bylineUrl, imageMode, riderId])
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
    const val = await this.findAll(query, values, `Error: could not find rider for name='${name}' and and gender=${gender}`)
    return { id: val.id, club: val.club, uid: val.uid, gender: val.gender, name: val.name }
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

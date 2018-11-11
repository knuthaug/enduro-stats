const { Pool } = require('pg')
const config = require('./config')

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

  async insertRace(race) {

    const client = await this.pool.connect()
    try {
      const query = 'INSERT INTO races(name, stages, date) VALUES($1, $2, $3) ON CONFLICT(name) DO UPDATE SET stages = $2'
      const values = [race.name, race.stages, race.date]
      const res = await client.query(query, values)
    } catch(error) {
      console.log(error)
    } finally {
      await client.release()
    }
  }

  async insertStage(race, stage) {

    const client = await this.pool.connect()
    try {
      const query = 'INSERT INTO stages(name, number, race_id) VALUES($1, $2, (SELECT r.id FROM races r WHERE r.name = $3)) ON CONFLICT(number, race_id) DO NOTHING'
      const values = [stage.name, stage.number, race]
      const res = await client.query(query, values)
    } catch(error) {
      console.log(error)
    } finally {
      await client.release()
    }
  }

  destroy() {
    this.pool.end()
  }
}

module.exports = Db

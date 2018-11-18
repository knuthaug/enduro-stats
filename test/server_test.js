/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */

const supertest = require('supertest')
const tap = require('tap')
const sinon = require('sinon')
const rewire = require('rewire')
const app = rewire('../server/app.js')
const Db = require('../server/db.js')

const races = [
  {
    id: 1,
    name: 'test',
    year: 2012
  },
  {
    id: 2,
    name: "test2",
    year: 2013
  }
]

const db = new Db()
sinon.stub(db, 'findRaces').returns({ rows: races })
app.__set__('db', db)

tap.test('index page responds with 200', async t => {
  await supertest(app)
    .get('/')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

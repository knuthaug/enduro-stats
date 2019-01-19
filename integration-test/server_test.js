/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */

const supertest = require('supertest')
const tap = require('tap')
const sinon = require('sinon')
const rewire = require('rewire')
const { app, stop } = require('../server/app.js')

tap.test('index page responds with 200', async t => {
  await supertest(app)
    .get('/')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

tap.test('race index page responds with 200', async t => {
  await supertest(app)
    .get('/ritt')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

tap.test('rider index page responds with 200', async t => {
  await supertest(app)
    .get('/ryttere')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

tap.test('race page responds with 200 for one race', async t => {
  await supertest(app)
    .get('/ritt/acff26f96c230cfbafe3294fe5f5da06')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

tap.test('race page responds with 404 for race not found', async t => {
  await supertest(app)
    .get('/ritt/d6786b567668')
    .expect(404)
    .expect('Content-type', 'text/html; charset=utf-8')
    .expect('Cache-Control', 'public, max-age=60')
  t.end()
})

tap.test('rider page responds with 200 for one rider', async t => {
  await supertest(app)
    .get('/rytter/d6786b567668d7d9f4e61c69e04d5c3c')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

tap.test('rider page responds with 404 for rider not found', async t => {
  await supertest(app)
    .get('/rytter/d6786b567668d7d9f4e61c69e04d5')
    .expect(404)
    .expect('Content-type', 'text/html; charset=utf-8')
    .expect('Cache-Control', 'public, max-age=60')
  t.end()
})

tap.test('about page responds with 200', async t => {
  await supertest(app)
    .get('/om')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

tap.test('kalender page responds with 200', async t => {
  await supertest(app)
    .get('/kalender')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

tap.test('search page responds with 200', async t => {
  supertest(app)
    .post('/sok')
    .send('search=espen')
    .end((f) => {
      t.end()
    })
})

stop()

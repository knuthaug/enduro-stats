/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */

const supertest = require('supertest')
const tap = require('tap')
const sinon = require('sinon')
const rewire = require('rewire')
const app = require('../server/app.js')


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
    .get('/ritt/b5abd441f9b8afd93fc95a897d33d2a4')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
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

tap.test('rider page responds with 200 for about', async t => {
  await supertest(app)
    .get('/om')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

tap.test('rider page responds with 200 for about', async t => {
  await supertest(app)
    .get('/kalender')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
  t.end()
})

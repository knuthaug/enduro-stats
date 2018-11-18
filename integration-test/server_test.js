/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */

const supertest = require('supertest')
const tap = require('tap')
const app = require('../server/index.js')

tap.test('index page responds with 200', t => {
  supertest(app.app)
    .get('/')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
    .end((err, res) => {
      t.end()
    })

})

tap.test('race page responds with 200', t => {
  supertest(app.app)
    .get('/race/b5abd441f9b8afd93fc95a897d33d2a4')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
    .end((err, res) => {
      t.end()
    })

})

app.stop()

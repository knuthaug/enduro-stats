/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */

const supertest = require('supertest')
const tap = require('tap')
const app = require('../server/app.js')

tap.test('index page responds with 200', async t => {
  supertest(app)
    .get('/')
    .expect(200)
    .expect('Content-type', 'text/html; charset=utf-8')
    .end((err, res) => {
      t.end()
    })

})

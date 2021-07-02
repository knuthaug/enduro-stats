/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */

const tap = require('tap')
const sinon = require('sinon')
const rewire = require('rewire')
const { app, stop } = require('../server/app.js')

tap.test('index page responds with 200', t => {
  inject('/', t)
})

tap.test('race index page responds with 200', t => {
  inject('/ritt', t)
})

tap.test('rider index page responds with 200', t => {
  inject('/ryttere', t)
})

tap.test('race page responds with 200 for one race', t => {
  inject('/ritt/31cc5663f5067534cb4427ab9bc4cd91', t)
})

tap.test('race page responds with 404 for race not found', t => {
  inject('/ritt/d6786b567668', t, 'text/html', 404)
})

tap.test('rider page responds with 200 for one rider', t => {
  inject('/rytter/d6786b567668d7d9f4e61c69e04d5c3c', t)
})

tap.test('rider page responds with 404 for rider not found', t => {
  inject('/rytter/d6786b567668d7d9f4e61c69e04d5', t, 'text/html', 404)
})

tap.test('series page responds with 200 for one race in that series', t => {
  inject('/serie/31cc5663f5067534cb4427ab9bc4cd91', t)
})

tap.test('about page responds with 200', t => {
  inject('/om', t)
})

tap.test('kalender page responds with 200', t => {
  inject('/kalender', t)
})

// tap.test('search page responds with 200', t => {
//   app.inject({
//     method: 'POST',
//     url: '/sok',
//     payload: 'search=espen'
//   }).then(response => {
//     t.strictEqual(200, response.statusCode, `status is ${200}`)
//     t.strictEqual('application/json; charset=utf-8', response.headers['content-type'], `content-type is application/json`)
//     t.end()
//   })})

tap.test('graph api for comparison responds with 200', t => {
  inject('/api/graph/compare?uid=1234', t, 'application/json; charset=utf-8')
})

tap.test('graph api for rider page', t => {
  inject('/api/graph/rider/00fde8e308a30a453c1f22e9bf8600a8?type=percent', t, 'application/json; charset=utf-8')
})

function inject(url, t, contentType = 'text/html', status = 200) {
  app.inject({
    method: 'GET',
    url
  }).then(response => {
    t.strictEqual(status, response.statusCode, `status is ${status}`)
    t.strictEqual(contentType, response.headers['content-type'], `content-type is ${contentType}`)
    t.end()
  })
}

stop()

const tap = require('tap')

const { convertMsToTime } = require('../lib/time.js')

tap.test('converts ms to human readable time format', (t) => {
  t.equals(convertMsToTime('345456'), '05:45.4')
  t.equals(convertMsToTime('450700'), '07:30.7')
  t.equals(convertMsToTime('427700'), '07:07.7')
  t.end()
})

tap.test('handles null', (t) => {
  t.equals(convertMsToTime('0'), '00:00.0')
  t.equals(convertMsToTime(null), '00:00.0')
  t.end()
})

tap.test('handles number in addition to strings', (t) => {
  t.equals(convertMsToTime(345456), '05:45.4')
  t.end()
})




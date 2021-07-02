const tap = require('tap')

const { convertMsToTime, convertTimeToMs } = require('../../lib/time.js')

tap.test('converts ms to human readable time format', (t) => {
  t.equal(convertMsToTime('345456'), '05:45.4', 'handles normal minutes/second/ms format')
  t.equal(convertMsToTime('450700'), '07:30.7', 'handles normal minutes/second/ms format')
  t.equal(convertMsToTime('427700'), '07:07.7', 'handles normal minutes/second/ms format')
  t.end()
})

tap.test('handles null', (t) => {
  t.equal(convertMsToTime('0'), '00:00.0', 'zero is all zeroes')
  t.equal(convertMsToTime(null), '00:00.0', 'null is all zeroes')
  t.end()
})

tap.test('handles number in addition to strings', (t) => {
  t.equal(convertMsToTime(345456), '05:45.4', 'number is also supported')
  t.end()
})

// tap.test('handles number in addition to strings', (t) => {
//   t.equal(convertMsToTime(44075), '00:44.1', 'rounds up fractional seconds')
//   t.end()
// })

tap.test('handles hours', (t) => {
  t.equal(convertMsToTime(4345456), '01:12:25.4', 'hours is handled')
  t.end()
})

tap.test('converts from time to ms', (t) => {
  t.equal(convertTimeToMs(undefined), 0, 'undefined is 0')
  t.equal(convertTimeToMs(null), 0, 'null is 0')
  t.equal(convertTimeToMs('00.12'), 120, '. is millisecond divider')
  t.equal(convertTimeToMs('00.1'), 100, '. is millisecond divider')
  t.equal(convertTimeToMs('2:00'), 120000, 'just minutes')
  t.equal(convertTimeToMs('2:15'), 135000, 'minutes and second')
  t.equal(convertTimeToMs('02:15'), 135000, 'supports leading zero')
  t.equal(convertTimeToMs('02:15.6'), 135600, 'supports leading zero and ms')
  t.equal(convertTimeToMs('01:02:15'), 3735000, 'supports hours')
  t.equal(convertTimeToMs('06:04.6'), 364600, 'supports hours')
  t.end()
})

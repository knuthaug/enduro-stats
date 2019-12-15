const tap = require('tap')

const { convertMsToTime, convertTimeToMs } = require('../../lib/time.js')

tap.test('converts ms to human readable time format', (t) => {
  t.equals(convertMsToTime('345456'), '05:45.4', 'handles normal minutes/second/ms format')
  t.equals(convertMsToTime('450700'), '07:30.7', 'handles normal minutes/second/ms format')
  t.equals(convertMsToTime('427700'), '07:07.7', 'handles normal minutes/second/ms format')
  t.end()
})

tap.test('handles null', (t) => {
  t.equals(convertMsToTime('0'), '00:00.0', 'zero is all zeroes')
  t.equals(convertMsToTime(null), '00:00.0', 'null is all zeroes')
  t.end()
})

tap.test('handles number in addition to strings', (t) => {
  t.equals(convertMsToTime(345456), '05:45.4', 'number is also supported')
  t.end()
})

// tap.test('handles number in addition to strings', (t) => {
//   t.equals(convertMsToTime(44075), '00:44.1', 'rounds up fractional seconds')
//   t.end()
// })

tap.test('handles hours', (t) => {
  t.equals(convertMsToTime(4345456), '01:12:25.4', 'hours is handled')
  t.end()
})

tap.test('converts from time to ms', (t) => {
  t.equals(convertTimeToMs(undefined), 0, 'undefined is 0')
  t.equals(convertTimeToMs(null), 0, 'null is 0')
  t.equals(convertTimeToMs('00.12'), 120, '. is millisecond divider')
  t.equals(convertTimeToMs('00.1'), 100, '. is millisecond divider')
  t.equals(convertTimeToMs('2:00'), 120000, 'just minutes')
  t.equals(convertTimeToMs('2:15'), 135000, 'minutes and second')
  t.equals(convertTimeToMs('02:15'), 135000, 'supports leading zero')
  t.equals(convertTimeToMs('01:02:15'), 3735000, 'supports hours')
  t.equals(convertTimeToMs('06:04.6'), 364600, 'supports hours')
  t.end()
})
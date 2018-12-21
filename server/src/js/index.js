const bootstrap = require('bootstrap')
const tablesort = require('tablesort')
const feather = require('feather-icons')

function extendTableSort () {
  var cleanNumber = function (i) {
    return i.replace(/[^-?0-9.]/g, '')
  }

  var compareNumber = function (a, b) {
    a = parseFloat(a)
    b = parseFloat(b)

    a = isNaN(a) ? 0 : a
    b = isNaN(b) ? 0 : b

    return a - b
  }

  tablesort.extend('number', function (item) {
    return item.match(/^[-+]?[£\x24Û¢´€]?\d+\s*([,\.]\d{0,2})/) || // Prefixed currency
    item.match(/^[-+]?\d+\s*([,\.]\d{0,2})?[£\x24Û¢´€]/) || // Suffixed currency
    item.match(/^[-+]?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/) // Number
  }, function (a, b) {
    a = cleanNumber(a)
    b = cleanNumber(b)

    return compareNumber(b, a)
  })
}

document.addEventListener('DOMContentLoaded', function (event) {
  extendTableSort()
  const tables = document.querySelectorAll('table')

  for (var i = 0; i < tables.length; i++) {
    tablesort(tables[i], { descending: true })
  }

  feather.replace()
})

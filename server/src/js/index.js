const $ = require('jquery')
const buttons = require('bootstrap/js/dist/button.js')
const index = require('bootstrap/js/dist/index.js')
const tablesort = require('tablesort')
const feather = require('feather-icons')

window.jQuery = $
window.$ = $

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
  const tables = document.querySelectorAll('.main-table')

  for (var i = 0; i < tables.length; i++) {
    tablesort(tables[i], { descending: true })
  }

  feather.replace()
  setupSearch()
})

function setupSearch () {
  var form = document.getElementById('searchForm')
  var search = document.getElementById('searchField')

  form.addEventListener('submit', function (event) {
    const search = document.getElementById('searchField')
    if (search.getAttribute('data-uid')) {
      search.setAttribute('value', search.getAttribute('data-uid'))
    }
  })

  search.addEventListener('keyup', function (event) {
    if (event.code) {
      searchHint(event)
    }
  })

  search.addEventListener('change', function (e) {
    let _value = null

    let inputValue = search.value
    let options = document.getElementById('searchList').children
    let i = options.length

    while (i--) {
      let option = options[i]

      if (option.value == inputValue) {
        _value = option.getAttribute('data-uid')
        break
      }
    }

    if (_value == null) {
      return false
    }

    search.setAttribute('data-uid', _value)
    window.location.replace('/rytter/' + _value)
    e.preventDefault()
  })

  window.searchHintXHR = new XMLHttpRequest()
}

function searchHint (event) {
  // retireve the input element

  var input = event.target
  var list = document.getElementById('searchList')

  // minimum number of characters before we start to generate suggestions
  var min_characters = 2

  if (input.value.length < min_characters) {

  } else {
    // abort any pending requests
    window.searchHintXHR.abort()

    window.searchHintXHR.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // We're expecting a json response so we convert it to an object
        var response = JSON.parse(this.responseText)

        // clear any previously loaded options in the datalist
        list.innerHTML = ''

        response.forEach(function (item) {
          // Create a new <option> element.
          var option = document.createElement('option')
          option.setAttribute('data-uid', item.uid)
          // option.value = item.uid
          option.appendChild(document.createTextNode(item.name))
          // attach the option to the datalist element
          list.appendChild(option)
        })
      }
    }

    window.searchHintXHR.open('GET', '/api/search?q=' + input.value, true)
    window.searchHintXHR.send()
  }
}

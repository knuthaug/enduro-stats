
document.addEventListener('DOMContentLoaded', function (event) {
  setupCompareSearch()
})

function setupCompareSearch () {
  var form = document.getElementById('compare-search-form')
  var search = document.getElementById('compare-search-field')

  form.addEventListener('submit', function (event) {
    const search = document.getElementById('compare-search-field')
    if (search.getAttribute('data-uid')) {
      search.setAttribute('value', search.getAttribute('data-uid'))
    }
  })

  search.addEventListener('keyup', function (event) {
    if (event.code) {
      compareSearchHint(event)
    }
  })

  search.addEventListener('change', function (e) {
    let _value = null

    let inputValue = search.value
    let options = document.getElementById('compare-search-list').children
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

    //search.setAttribute('data-uid', _value)
    console.log(`add user ${_value}`)
    search.value = ''
    e.preventDefault()
  })

  window.compareSearchHintXHR = new XMLHttpRequest()
}

function compareSearchHint (event) {

  var input = event.target
  var list = document.getElementById('compare-search-list')

  var min_characters = 2

  if (input.value.length < min_characters) {

  } else {
    window.compareSearchHintXHR.abort()

    window.compareSearchHintXHR.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText)

        list.innerHTML = ''

        response.forEach(function (item) {
          var option = document.createElement('option')
          option.setAttribute('data-uid', item.uid)
          option.appendChild(document.createTextNode(item.name))
          list.appendChild(option)
        })
      }
    }

    window.compareSearchHintXHR.open('GET', '/api/search?q=' + input.value, true)
    window.compareSearchHintXHR.send()
  }
}

const feather = require('feather-icons')
const { convertMsToTime } = require('../../../lib/time.js')

document.addEventListener('DOMContentLoaded', function (event) {
  feather.replace()
  setupCompareSearch()
  setupShowHiders()
})

function setupShowHiders () {
  [...document.querySelectorAll('.shower')]
    .forEach(element => {
      element.addEventListener('click', e => {
        const cur = e.currentTarget
        cur.classList.toggle('plus-rotate')
        let el = cur.parentNode.nextSibling.nextSibling
        el.classList.toggle('hide')
        console.log(el)
        setupRaceDetailGraph(el.querySelectorAll('.race-graph')[0].getAttribute('id'))
      })
    })
}

function fetchData(){
  
}

function setupRaceDetailGraph(id) {
  Highcharts.chart(id, {
    chart: {
      events: {
        load: fetchData
      },
      borderColor: '#000000',
      borderWidth: 1,
      borderRadius: 2,
      style: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif"
      }
    },
    tooltip: {
      formatter: timeFormatter
    },
    title: {
      text: 'Totaltider i alle felles ritt'
    },
    yAxis: {
      title: {
        text: 'tid'
      },
      type: 'datetime',
      labels: {
        formatter: function() {
          return convertMsToTime(this.value)
        }
      }
    },
    xAxis: {
      title: {
        text: 'Ritt'
      },
      categories: data[0].data.map((d) => {
        return d[0]
      }),
      tickInterval: 1
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    series: [{}],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 700
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  })
}

function setupCompareSearch () {
  const form = document.getElementById('compare-search-form')
  const search = document.getElementById('compare-search-field')

  form.addEventListener('submit', formOnSubmit)
  search.addEventListener('keyup', searchOnKeyup)
  search.addEventListener('change', searchFieldOnChange)
  window.compareSearchHintXHR = new XMLHttpRequest()

  const icons = document.querySelectorAll('.icon')
  icons.forEach((s) => {
    s.innerHTML = feather.icons['x-circle'].toSvg()
    s.addEventListener('click', removeUser)
  })

  setupRaceGraph(document.getElementById('races-graph'))
}

function searchOnKeyup(event) {
  if (event.code) {
    compareSearchHint(event)
  }
}

function formOnSubmit(event) {
  const search = document.getElementById('compare-search-field')
  if (search.getAttribute('data-uid')) {
    search.setAttribute('value', search.getAttribute('data-uid'))
  }
}

function searchFieldOnChange(e) {
  const search = document.getElementById('compare-search-field')
  let uid
  let name

  let inputValue = search.value
  let options = document.getElementById('compare-search-list').children
  let i = options.length

  while (i--) {
    let option = options[i]

    if (option.value === inputValue) {
      uid = option.getAttribute('data-uid')
      name = option.value
      break
    }
  }

  if (uid === null) {
    return false
  }

  addUser(search.parentNode, uid, name)
  search.value = ''
  const list = document.getElementById('compare-search-list')

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  e.preventDefault()
}

function removeUser(event) {
  const form = document.getElementById('compare-search-form')
  const list = document.getElementById('compare-list')
  const item = event.target.closest('.list-group-item')

  list.removeChild(item)
  //find form item
  const formItem = document.getElementById(`${item.getAttribute('data-uid')}`)
  form.removeChild(formItem)
}

function addUser(form, uid, name) {
  const hidden = document.createElement('input')
  hidden.setAttribute('type', 'hidden')
  hidden.setAttribute('name', 'riders')
  hidden.value = uid
  hidden.setAttribute('id', uid)
  form.appendChild(hidden)

  const list = document.getElementById('compare-list')
  const listElement = document.createElement('li')

  const cross = document.createElement('i')
  cross.classList.add('icon')
  cross.innerHTML = feather.icons['x-circle'].toSvg()

  cross.addEventListener('click', removeUser)

  listElement.appendChild(cross)
  listElement.setAttribute('data-uid', uid)
  listElement.appendChild(document.createTextNode(name))
  listElement.classList.add('list-group-item-dark', 'list-group-item')
  list.appendChild(listElement)
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

function timeFormatter () {
  return `<span>${this.point.category}<br/>${this.series.name}<br/>totaltid: ${this.point.y === 0 ? 'DNF' : convertMsToTime(this.point.y)}</span>`
}

function setupRaceGraph (element) {
  if(!element) {
    return
  }

  const data = JSON.parse(element.getAttribute(`data-object`))

  Highcharts.chart(element.getAttribute('id'), {
    chart: {
      borderColor: '#000000',
      borderWidth: 1,
      borderRadius: 2,
      style: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif"
      }
    },
    tooltip: {
      formatter: timeFormatter
    },
    title: {
      text: 'Totaltider i alle felles ritt'
    },
    yAxis: {
      title: {
        text: 'tid'
      },
      type: 'datetime',
      labels: {
        formatter: function() {
          return convertMsToTime(this.value)
        }
      }
    },
    xAxis: {
      title: {
        text: 'Ritt'
      },
      categories: data[0].data.map((d) => {
        return d[0]
      }),
      tickInterval: 1
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    series: data,
    responsive: {
      rules: [{
        condition: {
          maxWidth: 700
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  })
}


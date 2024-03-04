const feather = require('feather-icons')
const { convertMsToTime } = require('../../lib/time.js')
const charts = require('./charts.js')
const ui = require('./ui.js')

const { input, li, i, a, option } = ui.create()

document.addEventListener('DOMContentLoaded', function (event) {
  feather.replace()
  setupCompareSearch()
  setupShowHiders()
  setupSelectors()
})

function setupSelectors () {
  const selectors = document.querySelectorAll('.graph-selector')
  selectors.forEach((element) => {
    element.addEventListener('change', (event) => {
      const target = event.currentTarget
      const els = target.parentNode.childNodes

      for (let i = 0; i < els.length; i++) {
        if (els[i].nodeName === 'DIV') {
          const id = els[i].getAttribute('id')
          const selector = document.getElementById(`selector-${id}`)
          const type = selector.options[selector.selectedIndex].value
          setupRaceDetailGraph(id, type)
          break
        }
      }
    })
  })
}

function setupShowHiders () {
  [...document.querySelectorAll('.shower')]
    .forEach(element => {
      element.addEventListener('click', e => {
        const cur = e.currentTarget
        cur.classList.toggle('plus-rotate')
        const el = cur.parentNode.nextSibling.nextSibling
        el.classList.toggle('hide')
        // console.log(el)
        if (!el.classList.contains('hide')) {
          const id = el.querySelectorAll('.race-graph')[0].getAttribute('id')
          const selector = document.getElementById(`selector-${id}`)
          const type = selector.options[selector.selectedIndex].value
          setupRaceDetailGraph(id, type)
        }
      })
    })
}

async function fetchData (id) {
  const el = document.getElementById(id)
  const race = el.getAttribute('data-race')
  const selector = document.getElementById(`selector-${id}`)
  const type = selector.options[selector.selectedIndex].value

  const ridersParam = el.getAttribute('data-riders').split(';').map((r) => {
    return `riders=${r}`
  }).join('&')

  return fetch(`/api/graph/compare?type=${type}&race=${race}&${ridersParam}`)
    .then(response => response.json())
    .then(json => json)
}

function yAxisTitle (type) {
  if (type === 'times' || type === 'acc-times') {
    return 'Sekunder'
  }

  return 'Plass'
}

function title (type) {
  if (type === 'times') {
    return 'Tid bak'
  }

  if (type === 'acc-times') {
    return 'Total tid bak'
  }

  return 'Etappeplasseringer'
}

function findFormatter (type) {
  if (type === 'times' || type === 'acc-times') {
    return function () {
      return `<span>${this.series.name}<br/>${this.point.x} etappe: ${Math.abs(this.point.y)} sekunder ${this.point.y < 0 ? 'foran' : 'bak'} innbyrdes vinner</span>`
    }
  }
  return function () {
    return `<span>${this.series.name}<br/>${this.point.x} etappe: ${this.point.y === 0 ? 'DNF' : this.point.y + '. plass'}</span>`
  }
}

async function setupRaceDetailGraph (id, type) {
  Highcharts.chart(id, {
    chart: charts.chartOptions(),
    tooltip: {
      formatter: findFormatter(type)
    },
    title: {
      text: title(type)
    },
    yAxis: {
      title: {
        text: yAxisTitle(type)
      },
      tickInterval: 1
    },
    xAxis: {
      title: {
        text: 'Etappe'
      },
      tickInterval: 1
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    series: await fetchData(id),
    responsive: {
      rules: [{
        condition: {
          minHeight: 400
        },
        chartOptions: {
          legend: charts.legendOptions()
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

function searchOnKeyup (event) {
  if (event.code) {
    compareSearchHint(event)
  }
}

function formOnSubmit (event) {
  const search = document.getElementById('compare-search-field')
  if (search.getAttribute('data-uid')) {
    search.setAttribute('value', search.getAttribute('data-uid'))
  }
}

function searchFieldOnChange (e) {
  const search = document.getElementById('compare-search-field')
  let uid
  let name

  const inputValue = search.value
  const options = document.getElementById('compare-search-list').children
  let i = options.length

  while (i--) {
    const option = options[i]

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
    list.removeChild(list.firstChild)
  }
  e.preventDefault()
}

function removeUser (event) {
  const form = document.getElementById('compare-search-form')
  const list = document.getElementById('compare-list')
  const item = event.target.closest('.list-group-item')

  list.removeChild(item)
  // find form item
  const formItem = document.getElementById(`${item.getAttribute('data-uid')}`)
  form.removeChild(formItem)
}

function addUser (form, uid, name) {
  const hidden = input({ type: 'hidden', name: 'riders', value: uid, id: uid })
  form.appendChild(hidden)

  const list = document.getElementById('compare-list')
  const iEl = i({ class: 'icon', onclick: removeUser })
  iEl.innerHTML = feather.icons['x-circle'].toSvg()
  const listElement = li({ 'data-uid': uid, class: ['list-group-item-dark', 'list-group-item'] }, [iEl, a({ href: `/rytter/${uid}` }, name)])
  list.appendChild(listElement)
}

function compareSearchHint (event) {
  const input = event.target
  const list = document.getElementById('compare-search-list')

  const min_characters = 2

  if (input.value.length < min_characters) {

  } else {
    window.compareSearchHintXHR.abort()

    window.compareSearchHintXHR.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(this.responseText)

        list.innerHTML = ''

        response.forEach(function (item) {
          list.appendChild(option({ 'data-uid': item.uid }, item.name))
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
  if (!element) {
    return
  }

  const data = JSON.parse(element.getAttribute('data-object'))

  Highcharts.chart(element.getAttribute('id'), {
    chart: charts.chartOptions(),
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
        formatter: function () {
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
    responsive: charts.responsiveOptions()
  })
}

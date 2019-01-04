/* global Highcharts */

const format = require('date-fns/format')
const parse = require('date-fns/parse')
const feather = require('feather-icons')

document.addEventListener('DOMContentLoaded', function (event) {
  feather.replace()

  const graphs = document.querySelectorAll('.race-prog-graph')
  graphs.forEach((element) => {
    setupRaceGraph(element)
  })

  const selectors = document.querySelectorAll('.graph-selector')
  selectors.forEach((element) => {
    element.addEventListener('change', (event) => {
      const target = event.currentTarget
      let els = target.parentNode.childNodes

      for (let i = 0; i < els.length; i++) {
        if (els[i].nodeName === 'DIV') {
          setupRaceGraph(els[i], target.options[target.selectedIndex].value)
          break
        }
      }
    })
  })

  setupShowHideRace()
})


function setupShowHideRace () {
  [...document.querySelectorAll('.race-shower')]
    .forEach(element => {
      element.addEventListener('click', e => {
        const cur = e.currentTarget
        cur.classList.toggle('plus-rotate')
        let el = cur.parentNode.parentNode.nextSibling
        let i = 0
        while (el) {
          if (el.nodeName === 'TR') {
            el.classList.toggle('hide')
            const graphEl = el.querySelectorAll('.race-detail-graph')
            setupRaceDetailGraph(graphEl[0])
            break
          }
          el = el.nextSibling
          i++
        }
      })
    })
}

function placeFormatter () {
  return `<span>${this.series.name}<br/>${this.point.x} etappe: ${this.point.y} . plass</span>`
}

function timeFormatter () {
  return `<span>${this.series.name}<br/>${this.point.x} etappe: ${this.point.y} sekunder bak</span>`
}

function setupRaceDetailGraph (element) {
  const data = JSON.parse(element.getAttribute('data-object'))

  Highcharts.chart(element.getAttribute('id'), {
    chart: {
      borderColor: '#000000',
      borderWidth: 1,
      borderRadius: 2,
      style: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif"
      }
    },
    title: {
      text: 'Nærmeste konkurrenter',
      style: {
        color: '#FFFFFF',
        'font-size': '90%',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      formatter: function () {
        if(this.point.y < 0 ) {
          return `<span>${this.series.name}<br/>${this.point.x} etappe:${Math.abs(this.point.y)} sekunder foran</span>`
        }
        return `<span>${this.series.name}<br/>${this.point.x} etappe:${Math.abs(this.point.y)} sekunder bak</span>`
      }
    },
    yAxis: {
      title: {
        text: 'Sekunder før/etter'
      }
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
    series: data,
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
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


function setupRaceGraph (element, graph) {
  const index = element.getAttribute('data-highcharts-chart')

  if (index) { // existing graph
    const chart = Highcharts.charts[index]
    const data = JSON.parse(element.getAttribute(`data-object-${graph}`))

    chart.update({
      tooltip: {
        formatter: graph === 'places' ? placeFormatter : timeFormatter
      },
      yAxis: {
        title: {
          text: graph === 'places' ? 'Plass' : 'Sekunder'
        },
        type: 'linear'
      },
      series: data
    })
  } else {
    const data = JSON.parse(element.getAttribute(`data-object-places`))

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
        formatter: placeFormatter
      },

      title: {
        text: 'Rittforløp'
      },

      yAxis: {
        title: {
          text: 'Plass'
        },
        type: 'linear'
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
}

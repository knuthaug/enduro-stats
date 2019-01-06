/* global Highcharts */

const format = require('date-fns/format')
const parse = require('date-fns/parse')
const feather = require('feather-icons')

document.addEventListener('DOMContentLoaded', function (event) {
  feather.replace()
  setupGraph()
  setupShowHideRider()
})

function setupShowHideRider () {
  [...document.querySelectorAll('.shower')]
    .forEach(element => {
      element.addEventListener('click', e => {
        const cur = e.currentTarget
        cur.classList.toggle('plus-rotate')
        let el = cur.parentNode.parentNode.nextSibling

        let i = 0
        while (el) {
          if (el.nodeName === 'TR') {
            el.classList.toggle('hide')
            setupRaceGraph(el.querySelectorAll('.race-graph')[0])
            break
          }
          el = el.nextSibling
          i++
        }
      })
    })
}

function setupRaceGraph (element) {
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
      text: 'Etappeplasseringer',
      style: {
        color: '#FFFFFF',
        'font-size': '90%',
        fontWeight: 'normal'
      }
    },
    yAxis: {
      title: {
        text: 'Plass'
      }
    },
    xAxis: {
      title: {
        text: 'Etappe'
      },
      tickInterval: 1
    },
    tooltip: {
      formatter: function () {
        return `<span>${this.point.x} etappe:${Math.abs(this.point.y)}. plass</span>`
      }
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    series: [{
      showInLegend: false,
      data: data,
      pointStart: 1,
      name: 'Plass'
    }],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 400
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

function setupGraph () {
  const el = document.getElementById('rider-chart')
  const data = JSON.parse(el.getAttribute('data-object'))

  Highcharts.chart('rider-chart', {

    title: {
      text: 'Rittplasseringer'
    },

    yAxis: {
      title: {
        text: 'Plass i klasse'
      }
    },
    chart: {
      borderColor: '#000000',
      borderWidth: 1,
      borderRadius: 2,
      style: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif"
      }
    },
    xAxis: {
      title: {
        text: 'År'
      },
      type: 'datetime',
      labels: {
        formatter: function () {
          return format(parse(data[this.value].x), 'YYYY')
        },
        step: 1
      }

    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    tooltip: {
      formatter: function () {
        const pointData = data.find((row) => {
          return row.x === this.point.options.name
        })
        return `<span>${pointData.x} ${pointData.race} <br/> ${pointData.class}: ${pointData.y}. plass </span>`
      }
    },

    series: [{
      name: 'Plassering',
      data: data.map((e) => { return [ e.x, e.y ] })
    }],

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

/* global Highcharts */

const format = require('date-fns/format')
const parse = require('date-fns/parse')

document.addEventListener('DOMContentLoaded', function (event) {
  setupGraph()

  const graphs = document.querySelectorAll('.race-graph')
  graphs.forEach((element) => {
    setupRaceGraph(element)
  })
})

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
    borderColor: '#222222',
    borderWidth: 1,
    borderRadius: 2,
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
        return '<span>' + pointData.x + ' ' + pointData.race + ': ' + pointData.y + ' </span>'
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

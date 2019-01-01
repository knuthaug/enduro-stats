/* global Highcharts */

const format = require('date-fns/format')
const parse = require('date-fns/parse')

document.addEventListener('DOMContentLoaded', function (event) {
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
})

function placeFormatter () {
  return '<span>' + this.point.x + ' etappe: ' + this.point.y + '. plass</span>'
}

function timeFormatter () {
  return '<span>' + this.point.x + ' etappe: ' + this.point.y / 1000 + ' sekunder bak</span>'
}

function setupRaceGraph (element, graph) {
  const index = element.getAttribute('data-highcharts-chart')

  if (index) { // existing graph
    const chart = Highcharts.charts[index]
    const data = JSON.parse(element.getAttribute(`data-object-${graph}`))

    for (let i = 0; i < data.length; i++) {
      console.log(data[i])
    }

    chart.update({
      tooltip: {
        formatter: graph === 'places' ? placeFormatter : timeFormatter
      },
      yAxis: {
        title: {
          text: graph === 'places' ? 'Plass' : 'Tid'
        },
        type: graph === 'places' ? 'linear' : 'datetime'
      },
      series: data
    })
  } else {
    const data = JSON.parse(element.getAttribute(`data-object-places`))

    Highcharts.chart(element.getAttribute('id'), {

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

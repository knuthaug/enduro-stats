/* global Highcharts */

const format = require('date-fns/format')
const parse = require('date-fns/parse')

document.addEventListener('DOMContentLoaded', function (event) {
  const graphs = document.querySelectorAll('.race-prog-graph')
  graphs.forEach((element) => {
    setupRaceGraph(element)
  })
})

function setupRaceGraph(element) {
  const data = JSON.parse(element.getAttribute('data-object'))

  Highcharts.chart(element.getAttribute('id'), {

    title: {
      text: 'Rittforløp',
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


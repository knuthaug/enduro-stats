/* global Highcharts */

const format = require('date-fns/format')
const parse = require('date-fns/parse')

document.addEventListener('DOMContentLoaded', function (event) {
  setupGraph()

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
       text: 'Ryyter'
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
      name: 'Rytter'
   }],

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


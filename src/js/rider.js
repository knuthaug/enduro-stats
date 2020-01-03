/* global Highcharts */

const format = require('date-fns/format')
const parse = require('date-fns/parse')
const feather = require('feather-icons')
const charts = require('./charts.js')

document.addEventListener('DOMContentLoaded', function (event) {
  feather.replace()

  //graph selector click handler
  const selectors = document.querySelectorAll('.rider-graph-selector')
  selectors.forEach((element) => {
    element.addEventListener('change', (event) => {
      const target = event.currentTarget
      let els = target.parentNode.childNodes

      for (let i = 0; i < els.length; i++) {
        if (els[i].nodeName === 'DIV') {
          setupGraph(els[i], target.options[target.selectedIndex].value)
          break
        }
      }
    })
  })
  setupGraph(document.getElementById('rider-chart'), 'percent')
  setupShowHideRider()
})

function setupShowHideRider () {
  [...document.querySelectorAll('.shower')]
    .forEach(element => {
      element.addEventListener('click', e => {
        const cur = e.currentTarget
        cur.classList.toggle('plus-rotate')
        let el = cur.parentNode.parentNode.nextSibling.nextSibling
        el.classList.toggle('hide')
        setupRaceGraph(el.querySelectorAll('.race-graph')[0])
      })
    })
}

function setupRaceGraph (element) {
  const data = JSON.parse(element.getAttribute('data-object'))

  Highcharts.chart(element.getAttribute('id'), {
    chart: charts.chartOptions(),
    title: {
      text: 'Etappeplasseringer %',
      style: charts.smallChartTitleStyle()
    },
    yAxis: {
      title: {
        text: 'Plass %'
      },
    },
    xAxis: {
      title: {
        text: 'Etappe'
      },
      tickInterval: 1
    },
    legend: {
      labelFormat: "{point.y:.2f}"
    },
    tooltip: {
      formatter: function () {
        return `<span>${this.point.x} etappe: ${Math.abs(this.point.y).toFixed(1)} plass % av antall i klasse</span>`
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
      name: 'Plass %'
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

function chooseTooltip(data, graph) {

  if(graph === 'places') {
    return function () {
      const pointData = data.find((row) => {
        return row.x === this.point.options.name
      })
      return `<span>${pointData.x} ${pointData.race} <br/> ${pointData.class}: ${pointData.y}. plass </span>`
    }
  }
  return function () {
    const pointData = data.find((row) => {
      return row.x === this.point.options.name
    })
    return `<span>${pointData.x} ${pointData.race} <br/> ${pointData.class}: ${pointData.y.toFixed(1)} % av antall i klasse </span>`
  }
}

async function fetchData(riderUid) {
  const selector = document.getElementById(`rider-graph-selector`)
  const type = selector.options[selector.selectedIndex].value

  return fetch(`/api/graph/rider/${riderUid}?type=${type}`)
    .then(response => response.json())
    .then(json => json)
}

function yAxisGraphTitle(graph) {
  return graph === 'places' ? 'Plass i klasse' : 'Plass % i klasse'
}

function yAxisLabel(graph) {
  return graph === 'places' ? '{value}' : "{value:.2f} %"
}

function graphTitle(graph) {
  return graph === 'places' ? 'Rittplasseringer' : 'Rittplasseringer %'
}

function seriesName(graph) {
  return graph === 'places' ? 'Plassering' : 'Plassering %'
}

async function updateGraph(index, uid, graph) {
  const chart = Highcharts.charts[index]
  const data = await fetchData(uid)
  chart.update({
    yAxis: {
      title: {
        text: yAxisGraphTitle(graph) 
      },
      type: 'linear',
      labels: {
        format: yAxisLabel(graph)
      }
    },
    title: {
      text: graphTitle(graph)
    },
    tooltip: {
      formatter: chooseTooltip(data, graph)
    },
    series: [{
      name: seriesName(graph),
      data: data.map((e) => { return [ e.x, e.y ] })
    }]
  })
}

async function newGraph(id, uid, graph) {
  const data = await fetchData(uid)
    Highcharts.chart(id, {

      title: {
        text: graphTitle(graph)
      },

      yAxis: {
        title: {
          text: yAxisGraphTitle(graph)
        },
        labels: {
          format: yAxisLabel(graph)
        }
      },
      chart: charts.chartOptions(),
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
        formatter: chooseTooltip(data, graph)
      },

      series: [{
        name: seriesName(graph),
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

async function setupGraph (el, graph) {
  const index = el.getAttribute('data-highcharts-chart')
  const g = document.querySelectorAll('[data-uid]')[0]
  const uid = g.getAttribute('data-uid')

  if (index) { // existing graph
    updateGraph(index, uid, graph)
  } else {
    newGraph(el.getAttribute('id'), uid, graph)
  }
}

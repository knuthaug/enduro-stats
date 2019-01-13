/* global Highcharts */

const format = require('date-fns/format')
const parse = require('date-fns/parse')
const feather = require('feather-icons')

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


function setupGraph (el, graph) {
  const index = el.getAttribute('data-highcharts-chart')

  if (index) { // existing graph
    const chart = Highcharts.charts[index]
    const data = JSON.parse(el.getAttribute(`data-object-${graph}`))

    chart.update({
      yAxis: {
        title: {
          text: graph === 'places' ? 'Plass i klasse' : 'Plass % i klasse'
        },
        type: 'linear'
      },
      title: {
        text: graph === 'places' ? 'Rittplasseringer' : 'Rittplasseringer %'
      },
      tooltip: {
        formatter: chooseTooltip(data, graph)
      },
      series: [{
        name: graph === 'places' ? 'Plassering' : 'Plassering %',
        data: data.map((e) => { return [ e.x, e.y ] })
      }]
    })
  } else {
    const data = JSON.parse(el.getAttribute(`data-object-${graph}`))
    Highcharts.chart(el.getAttribute('id'), {

      title: {
        text: graph === 'places' ? 'Rittplasseringer' : 'Rittplasseringer %'
      },

      yAxis: {
        title: {
          text: graph === 'places' ? 'Plass i klasse' : 'Plass % i klasse'
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
        formatter: chooseTooltip(data, graph)
      },

      series: [{
        name: graph === 'places' ? 'Plassering' : 'Plassering %',
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
}

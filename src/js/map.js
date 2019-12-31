const L = require('leaflet')
const gpx = require('leaflet-gpx')

const colors = [
  {
    range: [15, 5],
    color: '#29f23d'
  },
  {
    range: [5, 0],
    color: '#1ec946'
  },
  {
    range: [0, -5],
    color: '#f55c53'
  },
  {
    range: [-5, -10],
    color: '#f33a2f'
  },
  {
    range: [-10, -15],
    color: '#b5140b'
  },
  {
    range: [-15, -20],
    color: '#961109'
  },
  {
    range: [-20, -25],
    color: '#700d07'
  },
  {
    range: [-25, -35],
    color: '#750606'
  },
  {
    range: [-35, -45],
    color: '#4f0202'
  }

]

document.addEventListener('DOMContentLoaded', function (event) {
  //load gpx files
  const json = document.querySelectorAll('[data-gpx]')[0].dataset.gpx.split(',')
  const data = JSON.parse(json)

  const parent = document.getElementById('details')
  var map = createMap(data)
  addFiles(map, data.stageDetails, parent)
})

function addFiles(map, stages, parent) {
  const sortedStages = stages.sort((a, b) => {
    return a.filename.localeCompare(b.filename)
  })

  let current = sortedStages[0]
  handleFile(current, parent, map, sortedStages, 0)
}

function handleFile(o, parent, map, stages, index) {
    new L.GPX(`https://d1hoqbrdo21qk8.cloudfront.net/gpx/${o.filename}`, {
      async: true,
      polyline_options: {
        color: '#458fd9',
        opacity: 1,
        weight: 5,
        clickable: true,
        lineCap: 'round'
      },
      marker_options: {
        startIconUrl: '/assets/img/pin-icon-start.png',
        endIconUrl: '/assets/img/pin-icon-end.png',
        shadowUrl: '/assets/img/pin-shadow.png',
        clickable: true
      }
    }).on('loaded', function(e) {
      //map.fitBounds(e.target.getBounds())
      const g = e.target
      e.target.bindTooltip(`<h4>${g.get_name()}</h4><p>Lengde: ${Math.round(g.get_distance())} meter, høydemeter: ${Math.round(g.get_elevation_loss())}</p>`, { direction: 'top'})

      //add details
      parent.appendChild(addCell(g, o))

      const row = document.createElement('div')
      row.classList.toggle("row")
      row.appendChild(addSpace('col-3'))
      row.appendChild(addSpace('col-6', 'details-row'))
      parent.appendChild(row)

      //graph
      setupGraph(g.get_name(), g._info.elevation._points)
      if(stages.length > index + 1) {
        handleFile(stages[index + 1], parent, map, stages, index + 1)
      }
    }).addTo(map)
}

function startPoint(data) {
  return data.map(e => e[1]).reduce((acc, current) => {
    return Math.min(acc, current)
  }, 10000) - 25
}

function gradients(data) {
  const gradients = []

  for(let i = 0; i < data.length; i += 10) {
    const set = data.slice(i, i + 10)
    const gradient = (diff(set[set.length - 1][1], set[0][1]) /
                      diff(set[set.length - 1][0], set[0][0])) * 100
    gradients.push({
      showInLegend: false,
      type: 'column',
      name: `${gradient.toFixed(0)} %`,
      data: interpolate(set),
      color: colorFromGradient(gradient)
    })
  }

  return gradients
}

function interpolate(set) {
  const newSet = [set[0]]
  
  for(let i = 0; i < set.length - 1; i++) {
    const current = set[i]
    const next = set[i + 1]

    if(next[0] > current[0] + 1) {
      for(let j = current[0]; j < Math.floor(next[0] + 1); j++) {
        newSet.push([j, current[1]])
      }
    }
  }

  return newSet.sort((a, b) => {
    return a[0] - b[0]
  })
}

function colorFromGradient(gradient) {
  if(isNaN(gradient)) {
    gradient = 0
  }
  for(let color of colors) {
    if(gradient <= color.range[0] && gradient >= color.range[1] ) {
      return color.color
    }
  }
  return 'black' //positive gradient
}

function diff(point1, point2) {
  return point1 - point2
}

function setupGraph(id, data) {
 
  let series = gradients(data)
  series.push(
    {
      showInLegend: false,
      data: data,
      type: 'spline',
      pointStart: 1
    });

  Highcharts.chart(id, {
    chart: {
      borderColor: '#000000',
      borderWidth: 1,
      borderRadius: 2,
      style: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif"
      }
    },
    title: {
      text: `Høydeprofil ${id}`,
      style: {
        color: '#FFFFFF',
        'font-size': '90%',
        fontWeight: 'normal'
      }
    },
    yAxis: {
      title: {
        text: 'Høyde'
      },
      min: startPoint(data)
    },
    xAxis: {
      title: {
        text: 'Lengde'
      },
      tickInterval: 100
    },
    tooltip: {
      formatter: function () {
        if(this.series.userOptions.type === 'spline') {
          return `<span>${Math.abs(this.point.y).toFixed(1)} meter</span>`
        } else {
          return `<span>${this.series.userOptions.name}</span>`
        }
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0
      },
      series: {
        label: {
          connectorAllowed: false
        },
        lineWidth: 3
      }
    },
    series,
    responsive: {
      rules: [{
        condition: {
          maxWidth: 300
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

function addCell(g, stage) {
  const row = document.createElement('div')
  row.classList.toggle("row")
  row.appendChild(addSpace())

  const content = document.createElement('div')
  content.classList.toggle("col-3")

  const mapHolder = document.createElement('div')
  mapHolder.classList.toggle("col-7")

  const map = document.createElement('div')
  map.id = g.get_name()
  map.classList.toggle('map-chart-container')
  mapHolder.appendChild(map)

  const title = document.createElement('h3')
  const text = document.createTextNode(g.get_name())
  title.appendChild(text)
  content.appendChild(title)
  content.appendChild(addDetails(g, stage))
  row.appendChild(content)
  row.appendChild(mapHolder)
  return row
}

function addSpace(clazz = 'col-1', clazz2 = null) {
  const div = document.createElement('div')
  div.classList.toggle(clazz)
  if(clazz2) {
    div.classList.toggle(clazz2)
  }
  return div
}
 
function addDetails(g, stage) {
  const p = document.createElement('p')
  p.appendChild(row(g, 'Lengde: ', 'meter', g.get_distance()))
  p.appendChild(row(g, 'Høydemeter ned: ', 'meter', g.get_elevation_loss()))
  p.appendChild(row(g, 'Høydemeter opp: ', 'meter', g.get_elevation_gain()))
  p.appendChild(row(g, 'Gjennomsnittlig fall: ', '%', (g.get_elevation_loss() / g.get_distance()) * 100))
  //p.appendChild(rowLink(g, 'Strava-segment: ', stage.strava_name, stage.strava_url))
  //p.appendChild(row(g, 'Bestetid strava: ', '', ''))
  return p
}

function row(g, text, unit, value) {
  const span = document.createElement('span')
  const bold = document.createElement('strong')
  bold.appendChild(document.createTextNode(text))
  span.appendChild(bold)
  span.appendChild(document.createTextNode(`${Math.round(value)} ${unit}`))
  span.appendChild(document.createElement('br'))
  return span
}

function rowLink(g, text, urlText, url) {
  const span = document.createElement('span')
  const bold = document.createElement('strong')
  bold.appendChild(document.createTextNode(text))
  const a = document.createElement('a')
  a.href = url
  a.appendChild(document.createTextNode(urlText))
  span.appendChild(bold)
  span.appendChild(a)
  span.appendChild(document.createElement('br'))
  return span
}

function createMap(data) {
  const map = L.map('map').setView(data.center, data.zoom)
  const mtbmapTiles = 'https://mtbmap.no/tiles/osm/mtbmap/{z}/{x}/{y}.jpg'
  const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  L.tileLayer(mtbmapTiles, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & &copy <a href="https://mtbmap.no/info">mtbmap</a>'
  }).addTo(map)
  return map
}

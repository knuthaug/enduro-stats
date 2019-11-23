const L = require('leaflet')
const gpx = require('leaflet-gpx')

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
  new L.GPX(`/gpx/${o.filename}`, {
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

function setupGraph(id, data) {

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
      }
    },
    xAxis: {
      title: {
        text: 'Lengde'
      },
      tickInterval: 100
    },
    tooltip: {
      formatter: function () {
        return `<span>${Math.abs(this.point.y).toFixed(1)} meter</span>`
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

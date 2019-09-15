const L = require('leaflet')
const gpx = require('leaflet-gpx')

document.addEventListener('DOMContentLoaded', function (event) {
  //load gpx files
  const json = document.querySelectorAll('[data-gpx]')[0].dataset.gpx.split(',')
  const data = JSON.parse(json)

  const parent = document.getElementById('details')
  var map = createMap(data)
  addFiles(map, data.files, parent)
})

function addFiles(map, files, parent) {
  files.forEach((f, index) => {
    new L.GPX(`/gpx/${f}`, {
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
      parent.appendChild(addCell(g))

      if((index + 1) % 3 === 0) { //third cell, start new row
        console.log('new row')
        const content = document.createElement('div')
        content.classList.toggle("row")

        const space = document.createElement('div')
        space.classList.toggle("col-1")
        content.appendChild(space)
        parent.insertAdjacentElement('afterend', content)
        parent = content
      }
    }).addTo(map)
  })
}

function addCell(g) {
  const content = document.createElement('div')
  content.classList.toggle("col-3")
  const title = document.createElement('h3')
  const text = document.createTextNode(g.get_name())
  title.appendChild(text)
  content.appendChild(title)
  content.appendChild(addDetails(g))
  return content
}

function addDetails(g) {
  const p = document.createElement('p')
  p.appendChild(row(g, 'Lengde: ', 'meter', g.get_distance()))
  p.appendChild(row(g, 'Høydemeter ned: ', 'meter', g.get_elevation_loss()))
  p.appendChild(row(g, 'Høydemeter opp: ', 'meter', g.get_elevation_gain()))
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

function createMap(data) {
  const map = L.map('map').setView(data.center, 14)
  const mtbmapTiles = 'https://mtbmap.no/tiles/osm/mtbmap/{z}/{x}/{y}.jpg'
  const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  L.tileLayer(mtbmapTiles, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & &copy <a href="https://mtbmap.no/info">mtbmap</a>'
  }).addTo(map)
  return map
}

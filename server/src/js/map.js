const L = require('leaflet')
const gpx = require('leaflet-gpx')

document.addEventListener('DOMContentLoaded', function (event) {
  //load gpx files
  const json = document.querySelectorAll('[data-gpx]')[0].dataset.gpx.split(',')
  const data = JSON.parse(json)

  var map = L.map('map').setView(data.center, 14)
  const mtbmapTiles = 'https://mtbmap.no/tiles/osm/mtbmap/{z}/{x}/{y}.jpg'
  const osmTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  L.tileLayer(mtbmapTiles, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & &copy <a href="https://mtbmap.no/info">mtbmap</a>'
  }).addTo(map)


  data.files.forEach((f) => {
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
      e.target.bindPopup(`<h4>${e.target.get_name()}</h4><p>lengde: ${Math.round(e.target.get_distance())} meter, Høydemeter: ${Math.round(e.target.get_elevation_loss())}</p>`)
    }).addTo(map)
  })
})

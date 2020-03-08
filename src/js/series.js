const feather = require('feather-icons')
const ui = require('./ui.js')

const { h2 } = ui.create()

document.addEventListener('DOMContentLoaded', function (event) {
  feather.replace()
  setupShowHideRider()
})

function setupShowHideRider () {
  [...document.querySelectorAll('.shower')]
    .forEach(element => {
      element.addEventListener('click', handleRowExpand)
    })
}

async function handleRowExpand(event) {
  const cur = event.currentTarget
  cur.classList.toggle('plus-rotate')
  const row = cur.parentNode.parentNode
  let el = row.nextSibling.nextSibling
  el.classList.toggle('hide')
  const data = row.getAttribute('data-results')
  if(!data) {
    const uid = row.getAttribute('data-uid')
    fetch(`/api/series/rider/${uid}`)
      .then(response => response.json())
      .then(json => json)
      .then(data => {
        row.setAttribute('data-results', JSON.stringify(data))
        data.forEach(d => {
          console.log(d)
          const container = row.nextSibling.nextSibling.firstChild
          console.log(container)
          container.appendChild(h2(d.year))
        })
      })
  }

}
